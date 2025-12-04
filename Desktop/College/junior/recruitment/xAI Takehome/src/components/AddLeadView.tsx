import { useState } from 'react';
import { ArrowLeft, Building2, User, Mail, Phone, Globe, MapPin, Sparkles, Save } from 'lucide-react';

interface AddLeadViewProps {
    onBack: () => void;
    onSave: () => void; // Called after successful save to trigger refresh in parent
}

export function AddLeadView({ onBack, onSave }: AddLeadViewProps) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [autoFilled, setAutoFilled] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        company: '',
        website: '',
        industry: '',
        employees: '',
        location: '',
        firstName: '',
        lastName: '',
        jobTitle: '',
        email: '',
        phone: '',
        linkedin: '',
        stage: 'new',
        value: '',
        notes: '',
        tags: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        // Basic validation
        if (!formData.company || !formData.firstName || !formData.lastName || !formData.email) {
            alert("Please fill in all required fields (*)");
            return;
        }

        setIsSaving(true);
        try {
            const payload = {
                company: formData.company,
                contact: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                phone: formData.phone,
                stage: formData.stage,
                value: formData.value || "$0", // Default value if empty
                industry: formData.industry
                // Note: backend needs to support other fields if you want to save them (website, location, etc)
                // For now we map what we have in the backend model.
            };

            const response = await fetch('http://localhost:8000/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                onSave(); // Navigate back and refresh
            } else {
                const error = await response.json();
                alert(`Error saving lead: ${error.detail || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error saving lead:', error);
            alert('Failed to connect to server');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAnalyzeCompany = () => {
        setIsAnalyzing(true);
        // Simulate Grok API call
        setTimeout(() => {
            setIsAnalyzing(false);
            setAutoFilled(true);
            // Mock fill
            setFormData(prev => ({
                ...prev,
                industry: 'Technology',
                employees: '51-200',
                location: 'San Francisco, CA'
            }));
        }, 2000);
    };

    return (
        <div className="p-8">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                Back to Leads
            </button>

            <div className="mb-8">
                <h1 className="text-3xl mb-2">Add New Lead</h1>
                <p className="text-neutral-400">Enter lead information or let Grok AI analyze the company</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                        <h2 className="text-xl mb-6">Lead Information</h2>

                        <div className="space-y-6">
                            {/* Company Info Section */}
                            <div>
                                <h3 className="text-lg mb-4 flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-neutral-400" />
                                    Company Information
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-neutral-400 mb-2">
                                            Company Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="e.g., Acme Corporation"
                                            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-neutral-400 mb-2">Company Website</label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                                            <input
                                                name="website"
                                                value={formData.website}
                                                onChange={handleChange}
                                                type="url"
                                                placeholder="https://example.com"
                                                className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-neutral-400 mb-2">Industry</label>
                                            <select
                                                name="industry"
                                                value={formData.industry}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600"
                                            >
                                                <option value="">Select industry</option>
                                                <option value="Technology">Technology</option>
                                                <option value="Healthcare">Healthcare</option>
                                                <option value="Finance">Finance</option>
                                                <option value="Manufacturing">Manufacturing</option>
                                                <option value="Retail">Retail</option>
                                                <option value="Education">Education</option>
                                                <option value="Real Estate">Real Estate</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-neutral-400 mb-2">Company Size</label>
                                            <select
                                                name="employees"
                                                value={formData.employees}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600"
                                            >
                                                <option value="">Select size</option>
                                                <option>1-10</option>
                                                <option>11-50</option>
                                                <option>51-200</option>
                                                <option>201-500</option>
                                                <option>501-1000</option>
                                                <option>1000+</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-neutral-400 mb-2">Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                                            <input
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                type="text"
                                                placeholder="City, State, Country"
                                                className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info Section */}
                            <div className="pt-6 border-t border-neutral-800">
                                <h3 className="text-lg mb-4 flex items-center gap-2">
                                    <User className="w-5 h-5 text-neutral-400" />
                                    Contact Information
                                </h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-neutral-400 mb-2">
                                                First Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                type="text"
                                                placeholder="John"
                                                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-neutral-400 mb-2">
                                                Last Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                type="text"
                                                placeholder="Smith"
                                                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-neutral-400 mb-2">Job Title</label>
                                        <input
                                            name="jobTitle"
                                            value={formData.jobTitle}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="e.g., VP of Sales"
                                            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-neutral-400 mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                                            <input
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                type="email"
                                                placeholder="john.smith@example.com"
                                                className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-neutral-400 mb-2">Phone</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                                            <input
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                type="tel"
                                                placeholder="+1 (555) 123-4567"
                                                className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-neutral-400 mb-2">LinkedIn Profile</label>
                                        <input
                                            name="linkedin"
                                            value={formData.linkedin}
                                            onChange={handleChange}
                                            type="url"
                                            placeholder="https://linkedin.com/in/johnsmith"
                                            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info Section */}
                            <div className="pt-6 border-t border-neutral-800">
                                <h3 className="text-lg mb-4">Additional Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-neutral-400 mb-2">Pipeline Stage</label>
                                        <select
                                            name="stage"
                                            value={formData.stage}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600"
                                        >
                                            <option value="new">New</option>
                                            <option value="contacted">Contacted</option>
                                            <option value="qualified">Qualified</option>
                                            <option value="proposal">Proposal</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-neutral-400 mb-2">Estimated Deal Value</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                                            <input
                                                name="value"
                                                value={formData.value}
                                                onChange={handleChange}
                                                type="text"
                                                placeholder="50000"
                                                className="w-full pl-8 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-neutral-400 mb-2">Notes</label>
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleChange}
                                            rows={4}
                                            placeholder="Add any relevant notes about this lead..."
                                            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600 resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-neutral-400 mb-2">Tags</label>
                                        <input
                                            name="tags"
                                            value={formData.tags}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="e.g., high-priority, enterprise, q1-target"
                                            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600"
                                        />
                                        <p className="text-xs text-neutral-500 mt-1">Separate tags with commas</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-6 border-t border-neutral-800 flex gap-3">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        "Saving..."
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Save Lead
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={onBack}
                                    className="px-6 py-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Assistant Sidebar */}
                <div className="space-y-6">
                    {/* Grok AI Enrichment */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                        <h2 className="text-lg mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-purple-500" />
                            Grok AI Enrichment
                        </h2>
                        <p className="text-sm text-neutral-400 mb-4">
                            Let Grok automatically fill in company and contact details
                        </p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-neutral-400 mb-2">Company Website or LinkedIn</label>
                                <input
                                    type="text"
                                    placeholder="Enter URL to analyze"
                                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600"
                                />
                            </div>
                            <button
                                onClick={handleAnalyzeCompany}
                                disabled={isAnalyzing}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Sparkles className="w-5 h-5 animate-pulse" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Enrich with Grok
                                    </>
                                )}
                            </button>
                            {autoFilled && (
                                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                    <p className="text-sm text-green-500">✓ Information enriched successfully</p>
                                </div>
                            )}
                        </div>
                        <div className="mt-6 pt-6 border-t border-neutral-800">
                            <p className="text-xs text-neutral-500 mb-3">Grok can automatically find:</p>
                            <ul className="text-xs text-neutral-400 space-y-2">
                                <li>• Company size and industry</li>
                                <li>• Contact information</li>
                                <li>• Recent company news</li>
                                <li>• Technology stack</li>
                                <li>• Funding information</li>
                                <li>• Key decision makers</li>
                            </ul>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                        <h2 className="text-lg mb-4">Quick Actions</h2>
                        <div className="space-y-2">
                            <button className="w-full px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors text-left text-sm">
                                Import from CSV
                            </button>
                            <button className="w-full px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors text-left text-sm">
                                Import from LinkedIn
                            </button>
                            <button className="w-full px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors text-left text-sm">
                                Scan Business Card
                            </button>
                        </div>
                    </div>

                    {/* Lead Score Preview */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                        <h2 className="text-lg mb-4">Predicted Lead Score</h2>
                        <div className="flex items-center justify-center mb-4">
                            <div className="text-5xl text-neutral-600">--</div>
                        </div>
                        <p className="text-sm text-neutral-500 text-center">
                            Score will be calculated after saving
                        </p>
                    </div>

                    {/* Tips */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                        <h3 className="text-sm mb-3">💡 Tips</h3>
                        <ul className="text-xs text-neutral-400 space-y-2">
                            <li>• Use Grok AI to save time on data entry</li>
                            <li>• More complete profiles = better lead scoring</li>
                            <li>• Add tags for easier filtering later</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

