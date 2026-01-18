'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Globe, Shield, Edit, Save, Lock } from 'lucide-react';
import { userService, UserProfile } from '@/services/user';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await userService.getProfile();
        setProfile(profileData);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        // Set fallback profile data when API fails
        setProfile({
          id: 'APP-2025-001',
          name: 'Demo User',
          email: 'demo@example.com',
          phone: '+250 788 123 456',
          role: 'applicant'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
          <div className="flex flex-col items-center md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-green-600" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-800">{profile?.name || 'User'}</h1>
              <p className="text-gray-600">Applicant ID: {profile?.id || 'N/A'}</p>
              <div className="flex items-center justify-center md:justify-start mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-green-600 font-medium">Active</span>
              </div>
              <button className="mt-3 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center text-sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Full Name</p>
                  <p className="text-lg font-semibold text-gray-800">{profile?.name || 'N/A'}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Date of Birth</p>
                  <p className="text-lg font-semibold text-gray-800">January 15, 1995</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Gender</p>
                  <p className="text-lg font-semibold text-gray-800">Female</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Nationality</p>
                  <p className="text-lg font-semibold text-gray-800">Rwandan</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 md:col-span-2">
                  <p className="text-xs text-gray-500 mb-1">National ID</p>
                  <p className="text-lg font-semibold text-gray-800">1199580012345678</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 flex items-center">
                  <Mail className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Email Address</p>
                    <p className="text-sm font-semibold text-gray-800">{profile?.email || 'N/A'}</p>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 flex items-center">
                  <Phone className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Phone Number</p>
                    <p className="text-sm font-semibold text-gray-800">{profile?.phone || 'N/A'}</p>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 flex items-center">
                  <Phone className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Alternative Phone</p>
                    <p className="text-sm font-semibold text-gray-800">+250 722 987 654</p>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 flex items-center">
                  <MapPin className="w-5 h-5 text-red-600 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm font-semibold text-gray-800">Kigali, Gasabo, Remera</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Program Info */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Academic / Program Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Applied Program</p>
                  <p className="text-lg font-semibold text-gray-800">Advanced Frontend</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Cohort</p>
                  <p className="text-lg font-semibold text-gray-800">Spring 2025</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Intake Year</p>
                  <p className="text-lg font-semibold text-gray-800">2025</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Mode</p>
                  <p className="text-lg font-semibold text-gray-800">Full-time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Account Settings */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Account Settings</h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Username</p>
                  <p className="text-sm font-semibold text-gray-800">user2025</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Two-Factor Auth</p>
                    <p className="text-sm font-semibold text-gray-800">Enabled</p>
                  </div>
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-2">Notifications</p>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm text-gray-700">Email notifications</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm text-gray-700">SMS notifications</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg flex items-center justify-center">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
                <button className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg flex items-center justify-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}