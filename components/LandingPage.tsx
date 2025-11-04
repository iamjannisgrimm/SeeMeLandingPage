'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollReveal from './ScrollReveal'

gsap.registerPlugin(ScrollTrigger)

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Subtle fade-in animations for sections
      gsap.from('.fade-up', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.3,
        ease: 'power2.out'
      })

      // Phone mockup float animation
      gsap.to('.phone-float', {
        y: -20,
        duration: 3,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-slate-900">
            SeeMe
          </div>
          <button className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors">
            Download App
          </button>
        </div>
      </nav>

      {/* Hero Section - Welcome → Dashboard Reveal */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <ScrollReveal direction="up">
                <div className="space-y-6">
                  <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 font-[family-name:var(--font-space-grotesk)] leading-tight">
                    Your personal
                    <span className="text-blue-600"> network</span>
                    <br />of support
                  </h1>
                  <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                    AI coaches that understand you deeply, work together seamlessly, and keep everything private.
                  </p>
                </div>
              </ScrollReveal>
              
              <ScrollReveal direction="up" delay={0.2}>
                <div className="flex gap-4">
                  <button className="bg-slate-900 text-white px-8 py-4 rounded-full font-medium hover:bg-slate-800 transition-colors">
                    Start Your Journey
                  </button>
                  <button className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Watch Demo
                  </button>
                </div>
              </ScrollReveal>
            </div>

            <div className="relative fade-up">
              <div className="phone-float">
                <div className="w-80 h-[600px] mx-auto bg-slate-900 rounded-[3rem] p-2 shadow-2xl">
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                    {/* Dashboard Preview */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 h-full p-6">
                      <div className="space-y-6 pt-8">
                        <div className="text-center">
                          <div className="text-sm text-slate-500 mb-2">Today's Balance</div>
                          <div className="text-4xl font-bold text-slate-900">7.2</div>
                          <div className="text-sm text-emerald-600">Feeling strong today</div>
                        </div>
                        
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                          <div className="text-sm text-slate-600 mb-2">Today's Affirmation</div>
                          <div className="text-slate-800 font-medium">"I am capable of achieving my goals with grace and determination."</div>
                        </div>

                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                          <div className="text-sm text-slate-600 mb-3">Upcoming</div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <div className="w-5 h-5 bg-blue-600 rounded-full"></div>
                            </div>
                            <div>
                              <div className="font-medium text-slate-800">Career Check-in</div>
                              <div className="text-sm text-slate-500">Today at 3:00 PM</div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-5 h-5 bg-amber-400 rounded-full"></div>
                            <div className="text-sm font-medium text-amber-800">Gentle Reminder</div>
                          </div>
                          <div className="text-sm text-amber-700">You've been pushing hard lately. Let's check in on your energy levels.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 - Coach Experience */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="w-80 h-[600px] mx-auto bg-slate-900 rounded-[3rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-[2.5rem] overflow-hidden">
                  <div className="p-6 pt-12">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <div className="text-white text-lg">✨</div>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">Maya</div>
                          <div className="text-sm text-slate-500">Your Career Coach</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4">
                          <div className="text-slate-800 font-medium mb-2">Today's Focus</div>
                          <div className="text-slate-600 text-sm">Let's reflect on your Q4 career goals and create actionable steps.</div>
                        </div>

                        <div className="bg-purple-100/50 rounded-2xl p-4">
                          <div className="text-sm text-purple-700 mb-2">Curated Session</div>
                          <div className="text-purple-900 font-medium">Career Visioning</div>
                          <div className="text-sm text-purple-600 mt-1">45 minutes • Personalized for you</div>
                        </div>
                        
                        <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-medium">
                          Start Session
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-8">
              <div className="space-y-6 fade-up">
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 font-[family-name:var(--font-space-grotesk)]">
                  Coaches that
                  <span className="text-purple-600"> know you</span>
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed">
                  Not just generic advice. Each session is crafted specifically for your goals, challenges, and growth trajectory.
                </p>
              </div>
              
              <div className="space-y-4 fade-up">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                  </div>
                  <span className="text-slate-700">Personalized session themes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                  </div>
                  <span className="text-slate-700">Contextual conversations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                  </div>
                  <span className="text-slate-700">Guided growth framework</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 - Agentic Network */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6 fade-up">
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 font-[family-name:var(--font-space-grotesk)]">
                  A network that
                  <span className="text-emerald-600"> collaborates</span>
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed">
                  Your coaches work together, sharing insights to give you holistic support across all areas of your life.
                </p>
              </div>
              
              <div className="space-y-4 fade-up">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">M</div>
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">W</div>
                  </div>
                  <div className="text-slate-700 italic">"I'd like to loop in your wellness guide to balance career goals with your energy levels."</div>
                  <div className="text-sm text-slate-500 mt-2">Maya → Wellness Coach</div>
                </div>
              </div>
            </div>

            <div className="relative fade-up">
              <div className="w-80 h-[600px] mx-auto bg-slate-900 rounded-[3rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-blue-50 rounded-[2.5rem] overflow-hidden">
                  <div className="p-6 pt-12">
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <div className="text-sm text-slate-500 mb-2">Session in Progress</div>
                        <div className="flex justify-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <div className="text-white text-lg">M</div>
                          </div>
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                            <div className="text-white text-lg">W</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="bg-purple-100/60 backdrop-blur-sm rounded-2xl p-4 text-right">
                          <div className="text-sm text-purple-800">"Let's set ambitious Q4 goals for your career growth."</div>
                        </div>
                        
                        <div className="bg-emerald-100/60 backdrop-blur-sm rounded-2xl p-4">
                          <div className="text-sm text-emerald-800">"I notice your energy has been low lately. Let's integrate some wellness practices with those career goals."</div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center">
                          <div className="text-xs text-slate-500 mb-2">Collaborative Insight</div>
                          <div className="text-sm text-slate-700">"Balancing ambition with sustainable energy will help you achieve more in the long run."</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 - Privacy */}
      <section className="py-20 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="w-80 h-[600px] mx-auto bg-white rounded-[3rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-slate-900 rounded-[2.5rem] overflow-hidden">
                  <div className="p-6 pt-12 text-white">
                    <div className="space-y-8 text-center">
                      <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-10 h-10 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      
                      <div className="space-y-6">
                        <h3 className="text-2xl font-bold">Private & Secure</h3>
                        
                        <div className="space-y-4">
                          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="text-sm">All data stays on your device</span>
                            </div>
                          </div>
                          
                          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="text-sm">No cloud storage</span>
                            </div>
                          </div>
                          
                          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="text-sm">Never sold or shared</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-8">
              <div className="space-y-6 fade-up">
                <h2 className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-space-grotesk)]">
                  Your data.
                  <span className="text-emerald-400"> Your device.</span>
                  <br />Your control.
                </h2>
                <p className="text-xl text-slate-300 leading-relaxed">
                  Complete privacy isn't just a promise—it's built into our architecture. Your conversations never leave your device.
                </p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 fade-up">
                <div className="text-emerald-400 font-semibold mb-2">Our #1 Commitment</div>
                <div className="text-slate-200">
                  "In a world where your data is constantly harvested, SeeMe stands different. Your growth journey remains completely yours."
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-8 fade-up">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 font-[family-name:var(--font-space-grotesk)]">
              Ready to begin?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Join the community of people investing in themselves with AI that truly understands.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-slate-900 text-white px-8 py-4 rounded-full font-medium hover:bg-slate-800 transition-colors text-lg">
                Download for iOS
              </button>
              <button className="text-slate-600 hover:text-slate-900 transition-colors px-8 py-4 rounded-full border border-slate-200 hover:border-slate-300">
                Learn More
              </button>
            </div>

            <div className="pt-8 text-sm text-slate-500">
              Available now • Free to try • No subscription required
            </div>
          </div>
        </div>
      </section>

      {/* Simple footer */}
      <footer className="py-12 px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-slate-900">
              SeeMe
            </div>
            <div className="flex gap-8 text-sm text-slate-600">
              <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
