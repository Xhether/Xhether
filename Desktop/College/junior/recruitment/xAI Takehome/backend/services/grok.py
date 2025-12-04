import os
import json
import time
from openai import AsyncOpenAI
from typing import List, Dict, Any

class GrokService:
    def __init__(self):
        self.client = AsyncOpenAI(
            api_key=os.getenv("XAI_API_KEY"),
            base_url="https://api.x.ai/v1",
        )

    async def qualify_lead(self, lead_data: Dict[str, Any], model: str = "grok-beta") -> Dict[str, Any]:
        """
        Sends lead data to Grok for qualification.
        Returns a structured JSON response with score and reasoning.
        """
        prompt = f"""
        Analyze this sales lead and provide a qualification assessment.
        
        Lead Data:
        {json.dumps(lead_data, indent=2)}
        
        Return valid JSON only with this structure:
        {{
            "score": <integer 0-100>,
            "stage": <"qualified" | "disqualified" | "needs_review">,
            "reasoning": <string explanation>,
            "recommended_action": <string>
        }}
        """

        try:
            start_time = time.time()
            response = await self.client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": "You are an expert sales SDR assistant. You output only valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1  # Low temperature for consistent JSON
            )
            duration = time.time() - start_time
            
            content = response.choices[0].message.content
            
            # Clean up potential markdown formatting (```json ... ```)
            if "```" in content:
                content = content.split("```")[1].replace("json", "").strip()
                
            result = json.loads(content)
            result["_meta"] = {"latency": duration, "status": "success"}
            return result

        except Exception as e:
            return {
                "score": 0,
                "stage": "error",
                "reasoning": str(e),
                "_meta": {"latency": 0, "status": "failure", "error": str(e)}
            }

    async def run_evaluation(self, test_cases: List[Dict[str, Any]], models: List[str]):
        """
        Runs the dataset against multiple models to calculate:
        - Accuracy (did it match expected stage?)
        - Failure Rate (did it crash or return bad JSON?)
        - Latency (how fast was it?)
        """
        results = {}

        for model in models:
            print(f"Testing model: {model}")
            model_metrics = {
                "total": 0,
                "correct": 0,
                "failures": 0,
                "total_latency": 0
            }
            
            for case in test_cases:
                model_metrics["total"] += 1
                
                # Run prediction
                prediction = await self.qualify_lead(case["input"], model=model)
                
                # 1. Check Failure Rate
                if prediction["_meta"]["status"] == "failure":
                    model_metrics["failures"] += 1
                    continue
                
                model_metrics["total_latency"] += prediction["_meta"]["latency"]

                # 2. Check Accuracy (Lead Stage Match)
                # You could also check if score is within a range
                expected_stage = case["expected_output"]["qualification"]
                if prediction["stage"] == expected_stage:
                    model_metrics["correct"] += 1
            
            # Calculate final stats
            total = model_metrics["total"]
            results[model] = {
                "accuracy": (model_metrics["correct"] / total) * 100 if total > 0 else 0,
                "failure_rate": (model_metrics["failures"] / total) * 100 if total > 0 else 0,
                "avg_latency": model_metrics["total_latency"] / (total - model_metrics["failures"]) if (total - model_metrics["failures"]) > 0 else 0
            }
            
        return results
