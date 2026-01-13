import React, { useState } from 'react'
import { API_BASE_URL } from '../../config'
import { FiArrowLeft, FiUpload } from "react-icons/fi";
import {
    FaTwitter,
    FaGithub,
    FaInstagram,
    FaTiktok,
    FaLink,
    FaDiscord
} from "react-icons/fa";
import { Header } from '../navigation/Header';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface SocialLink {
    platform: string;
    url: string;
    icon: React.ComponentType<any>;
}

interface FormData {
    tokenName: string;
    tickerSymbol: string;
    cultLore: string;
    imageFile: File | null;
    imageBase64: string;
    preBuyAmount: string;
    tradingFeesTo: string[];
    socialLinks: SocialLink[];
}

const TRADING_FEE_OPTIONS = [
    { id: 'twitter', label: 'X', icon: FaTwitter },
    { id: 'github', label: 'GitHub', icon: FaGithub },
    { id: 'instagram', label: 'Instagram', icon: FaInstagram },
    { id: 'tiktok', label: 'TikTok', icon: FaTiktok },
    { id: 'link', label: 'Link', icon: FaLink },
    { id: 'discord', label: 'Discord', icon: FaDiscord }
];

const PRE_BUY_OPTIONS = ['1M', '10M', '21M', '1B', '1T'];

// @ts-ignore
const CreateToken: React.FC<{ showForm: boolean; setShowForm: React.Dispatch<React.SetStateAction<boolean>> }> = ({ showForm, setShowForm }) => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<FormData>({
        tokenName: '',
        tickerSymbol: '',
        cultLore: '',
        imageFile: null,
        imageBase64: '',
        preBuyAmount: '',
        tradingFeesTo: [],
        socialLinks: []
    });

    const handleInputChange = (field: keyof FormData, value: string | File | null) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleTradingFeeToggle = (optionId: string) => {
        const option = TRADING_FEE_OPTIONS.find(opt => opt.id === optionId);
        if (!option) return;

        setFormData(prev => {
            const isAlreadySelected = prev.tradingFeesTo.includes(optionId);

            if (isAlreadySelected) {
                // Remove from trading fees and social links
                return {
                    ...prev,
                    tradingFeesTo: prev.tradingFeesTo.filter(id => id !== optionId),
                    socialLinks: prev.socialLinks.filter(link => link.platform !== optionId)
                };
            } else {
                // Add to trading fees and social links
                return {
                    ...prev,
                    tradingFeesTo: [...prev.tradingFeesTo, optionId],
                    socialLinks: [...prev.socialLinks, {
                        platform: optionId,
                        url: '',
                        icon: option.icon
                    }]
                };
            }
        });
    };

    const handleSocialUrlChange = (platform: string, url: string) => {
        setFormData(prev => ({
            ...prev,
            socialLinks: prev.socialLinks.map(link =>
                link.platform === platform ? { ...link, url } : link
            )
        }));
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size too large (max 5MB)');
                return;
            }
            handleInputChange('imageFile', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                handleInputChange('imageBase64', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!user) {
            setError('Please connect your wallet first');
            return;
        }

        if (!formData.tokenName || !formData.tickerSymbol || !formData.cultLore || !formData.imageBase64) {
            setError('Please fill in all required fields and upload an image');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const socials: any = {};
            formData.socialLinks.forEach(link => {
                if (link.url) socials[link.platform] = link.url;
            });

            const response = await fetch(`${API_BASE_URL}/api/tokens`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.tokenName,
                    symbol: formData.tickerSymbol,
                    description: formData.cultLore,
                    logo: formData.imageBase64,
                    ...socials
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to launch token');
            }

            // Success! 
            navigate('/');
        } catch (err: any) {
            console.error('Launch error:', err);
            setError(err.message || 'Error launching token');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 pt-[130px] home-bg">
            <Header />
            <div className="w-full lg:px-[40px] px-[20px] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 ">
                {/* Form Section */}
                <div className="w-full  mx-auto lg:mx-0 bg-[#271431] px-[40px] py-[30px] rounded-3xl">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <button
                            onClick={() => setShowForm(false)}
                            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                        >
                            <FiArrowLeft size={20} />
                        </button>
                        <h1 className="text-white text-2xl lg:text-3xl font-bold">
                            Let's Start Your Cult.
                        </h1>
                    </div>

                    {/* Form */}
                    <div className="space-y-6">
                        {/* Two Column Layout for Image and Token Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Image Upload <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="w-full h-32 border-2 border-dashed border-gray-600 rounded-xl bg-[#2D1B47]/50 flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition-colors"
                                    >
                                        <FiUpload className="text-gray-400 text-lg mb-1" />
                                        <p className="text-gray-400 text-xs text-center px-2">
                                            click to upload<br />
                                            max 5Mb. PNG.<br />
                                            supported formats: JPEG, PNG, GIF<br />
                                            max dimensions: 1080x1080px
                                        </p>
                                    </label>
                                    {formData.imageFile && (
                                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                            ✓ Uploaded
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Token Name */}
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Token Name <span className="text-red-400">*</span>
                                    <span className="text-gray-400 ml-2">ⓘ</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="My Token Name"
                                    value={formData.tokenName}
                                    onChange={(e) => handleInputChange('tokenName', e.target.value)}
                                    className="w-full px-4 py-3 bg-[#2D1B47]/70 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                                />
                                <p className="text-gray-500 text-xs mt-1">{formData.tokenName.length}/32</p>
                            </div>
                        </div>

                        {/* Ticker Symbol */}
                        <div>
                            <label className="block text-white text-sm font-medium mb-2">
                                Ticker Symbol <span className="text-red-400">*</span>
                                <span className="text-gray-400 ml-2">ⓘ</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span>
                                <input
                                    type="text"
                                    placeholder="TICKER"
                                    value={formData.tickerSymbol}
                                    onChange={(e) => handleInputChange('tickerSymbol', e.target.value.toUpperCase())}
                                    className="w-full pl-8 pr-4 py-3 bg-[#2D1B47]/70 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                                />
                            </div>
                            <p className="text-gray-500 text-xs mt-1">{formData.tickerSymbol.length}/10</p>
                        </div>

                        {/* Cult Lore */}
                        <div>
                            <label className="block text-white text-sm font-medium mb-2">
                                Cult Lore <span className="text-red-400">*</span>
                                <span className="text-gray-400 ml-2">ⓘ</span>
                            </label>
                            <textarea
                                placeholder="Write A Little About Your Cult"
                                value={formData.cultLore}
                                onChange={(e) => handleInputChange('cultLore', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 bg-[#2D1B47]/70 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors resize-none"
                            />
                            <p className="text-gray-500 text-xs mt-1">{formData.cultLore.length}/512</p>
                        </div>


                        <div>
                            <label className="block text-white text-sm font-medium mb-3">
                                Your Socials
                            </label>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {TRADING_FEE_OPTIONS.map((option) => {
                                    const IconComponent = option.icon;
                                    const isActive = formData.tradingFeesTo.includes(option.id);

                                    return (
                                        <button
                                            key={option.id}
                                            onClick={() => handleTradingFeeToggle(option.id)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive
                                                ? 'bg-purple-600 text-white border border-purple-500'
                                                : 'bg-transparent text-gray-300 border border-gray-600 hover:border-gray-400'
                                                }`}
                                        >
                                            {IconComponent && <IconComponent size={16} />}
                                            <span>{option.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Social Media URL Inputs */}
                            {formData.socialLinks.length > 0 && (
                                <div className="space-y-3 mb-4">
                                    {formData.socialLinks.map((socialLink) => {
                                        const IconComponent = socialLink.icon;
                                        return (
                                            <div key={socialLink.platform} className="flex items-center gap-3">
                                                <div className="flex items-center gap-2 min-w-[100px]">
                                                    <IconComponent size={16} className="text-gray-400" />
                                                    <span className="text-gray-400 text-sm capitalize">
                                                        {socialLink.platform === 'twitter' ? 'X' : socialLink.platform}
                                                    </span>
                                                </div>
                                                <input
                                                    type="url"
                                                    placeholder={`Enter ${socialLink.platform === 'twitter' ? 'X' : socialLink.platform} URL`}
                                                    value={socialLink.url}
                                                    onChange={(e) => handleSocialUrlChange(socialLink.platform, e.target.value)}
                                                    className="flex-1 px-3 py-2 bg-[#2D1B47]/70 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-purple-400 transition-colors"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Pre-Buy */}
                        <div>
                            <label className="block text-white text-sm font-medium mb-3">
                                Pre-Buy (Optional) <span className="text-gray-400">●</span>
                            </label>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {PRE_BUY_OPTIONS.map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => handleInputChange('preBuyAmount',
                                            formData.preBuyAmount === option ? '' : option
                                        )}
                                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${formData.preBuyAmount === option
                                            ? 'bg-purple-600 text-white border border-purple-500'
                                            : 'bg-purple-900/50 text-purple-200 border border-purple-700 hover:bg-purple-800/50'
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-400/10 border border-red-400/20 rounded-xl">
                                    <p className="text-red-400 text-sm text-center font-medium">{error}</p>
                                </div>
                            )}

                            {/* Launch Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={loading || authLoading}
                                className={`w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${(loading || authLoading) ? "opacity-50 cursor-not-allowed scale-[0.98]" : "active:scale-95"
                                    }`}
                            >
                                {(loading || authLoading) && (
                                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                )}
                                {loading ? "Launching..." : "Launch Cult"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Doge Image Section */}
                <div className="hidden lg:flex items-center justify-center ">
                    <div className="w-full max-w-md">
                        <img
                            src="/images/l.png"
                            alt="Buff Doge"
                            className="w-full h-auto object-contain max-w-[400px]"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "/images/l.png";
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateToken;
