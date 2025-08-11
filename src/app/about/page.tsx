import { Users, Heart, Shield, Globe, Award, Zap } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const teamMembers = [
  {
    name: 'Kai Leilani',
    role: 'Founder & CEO',
    bio: 'Marine biologist with 15 years of experience in reef conservation',
    image: '🌺'
  },
  {
    name: 'Makoa Wong',
    role: 'Head of Safety',
    bio: 'Former lifeguard captain with expertise in ocean safety',
    image: '🏄'
  },
  {
    name: 'Leilani Pua',
    role: 'Marine Data Scientist',
    bio: 'PhD in Marine Biology, specializing in coral reef ecosystems',
    image: '🐠'
  },
  {
    name: 'Keoni Silva',
    role: 'Community Manager',
    bio: 'Connecting beach lovers and building our ohana',
    image: '🤙'
  }
]

const milestones = [
  { year: '2020', event: 'Beach Hui founded in Honolulu' },
  { year: '2021', event: 'Launched real-time beach monitoring' },
  { year: '2022', event: 'Added reef health tracking' },
  { year: '2023', event: 'Reached 50,000 active users' },
  { year: '2024', event: 'AI Beach Buddy launched' }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-ocean-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              About Beach Hui
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              We're on a mission to make Hawaii's beaches safer and more enjoyable for everyone 
              while protecting our precious marine ecosystems.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              Beach Hui was born from a simple belief: everyone deserves to enjoy Hawaii's beaches 
              safely while being stewards of our ocean environment.
            </p>
            <p className="text-gray-600 mb-4">
              We combine cutting-edge technology with local knowledge to provide real-time beach 
              conditions, safety alerts, and reef health monitoring. Our platform empowers both 
              locals and visitors to make informed decisions about when and where to enjoy our beaches.
            </p>
            <p className="text-gray-600">
              By fostering a community of beach lovers who share observations and respect the ocean, 
              we're creating a safer, more sustainable future for Hawaii's coastlines.
            </p>
          </div>
          <div className="bg-gradient-to-r from-ocean-400 to-purple-500 rounded-2xl p-8 text-white">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Shield className="h-8 w-8 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Safety First</h3>
                  <p className="text-ocean-50">Real-time alerts keep beach-goers informed and safe</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Heart className="h-8 w-8 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Ocean Conservation</h3>
                  <p className="text-ocean-50">Monitoring reef health to protect marine ecosystems</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Users className="h-8 w-8 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Community Driven</h3>
                  <p className="text-ocean-50">Powered by local knowledge and user reports</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-ocean-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-ocean-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Aloha Spirit</h3>
              <p className="text-gray-600">
                We embrace the spirit of aloha in everything we do, treating our ocean and 
                community with love and respect.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-600">
                We strive for accuracy and reliability in our data, ensuring you have the best 
                information for your beach adventures.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">
                We continuously improve our platform with the latest technology to serve our 
                users better.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Meet Our Team</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <div key={member.name} className="text-center">
              <div className="text-6xl mb-4">{member.image}</div>
              <h3 className="font-semibold text-gray-900">{member.name}</h3>
              <p className="text-ocean-600 text-sm mb-2">{member.role}</p>
              <p className="text-gray-600 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-gradient-to-b from-white to-ocean-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Journey</h2>
          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className="flex gap-4 mb-8">
                <div className="flex flex-col items-center">
                  <div className="bg-ocean-600 text-white rounded-full px-3 py-1 text-sm font-semibold">
                    {milestone.year}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 h-16 bg-ocean-200 mt-2"></div>
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <p className="text-gray-700">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-ocean-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join Our Beach Community
          </h2>
          <p className="text-ocean-100 mb-8 max-w-2xl mx-auto">
            Be part of our mission to keep Hawaii's beaches safe and beautiful for generations to come.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-white text-ocean-600 px-6 py-3 rounded-lg font-medium hover:bg-ocean-50 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/contact"
              className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}