"use client"

import type React from "react"

import { useState } from "react"
import {
  Calendar,
  Plus,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Lightbulb,
  Heart,
  Utensils,
  Dumbbell,
  Moon,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface HealthEntry {
  id: string
  date: string
  weight: number
  height: number
  bmi: number
  category: string
  pcosRisk: string
}

export default function Component() {
  const [entries, setEntries] = useState<HealthEntry[]>([])
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    weight: "",
    height: "",
  })

  const calculateBMI = (weight: number, height: number): number => {
    const heightInMeters = height / 100
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1))
  }

  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return "Underweight"
    if (bmi < 25) return "Normal weight"
    if (bmi < 30) return "Overweight"
    return "Obese"
  }

  const getPCOSRisk = (bmi: number): string => {
    if (bmi < 18.5) return "Low risk"
    if (bmi < 25) return "Low to moderate risk"
    if (bmi < 30) return "Moderate to high risk"
    return "High risk"
  }

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "Underweight":
        return "bg-blue-100 text-blue-800"
      case "Normal weight":
        return "bg-green-100 text-green-800"
      case "Overweight":
        return "bg-yellow-100 text-yellow-800"
      case "Obese":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRiskColor = (risk: string): string => {
    switch (risk) {
      case "Low risk":
        return "bg-green-100 text-green-800"
      case "Low to moderate risk":
        return "bg-yellow-100 text-yellow-800"
      case "Moderate to high risk":
        return "bg-orange-100 text-orange-800"
      case "High risk":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const weight = Number.parseFloat(formData.weight)
    const height = Number.parseFloat(formData.height)

    // Better validation with specific error messages
    if (!formData.weight || !formData.height) {
      alert("Please fill in both weight and height fields")
      return
    }

    if (isNaN(weight) || isNaN(height)) {
      alert("Please enter valid numbers for weight and height")
      return
    }

    if (weight <= 0 || weight > 500) {
      alert("Please enter a valid weight between 1-500 kg")
      return
    }

    if (height <= 0 || height > 300) {
      alert("Please enter a valid height between 1-300 cm")
      return
    }

    const bmi = calculateBMI(weight, height)
    const category = getBMICategory(bmi)
    const pcosRisk = getPCOSRisk(bmi)

    const newEntry: HealthEntry = {
      id: Date.now().toString(),
      date: formData.date,
      weight,
      height,
      bmi,
      category,
      pcosRisk,
    }

    setEntries((prev) => [newEntry, ...prev])

    // Reset form with success feedback
    setFormData({
      date: new Date().toISOString().split("T")[0],
      weight: "",
      height: "",
    })

    // Optional: Add success message
    console.log("Entry added successfully:", newEntry)
  }

  const latestEntry = entries[0]

  return (
    <div
      className="min-h-screen p-4 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('/images/rectangle-10.svg')",
      }}
    >
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
      <div className="relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Health & BMI Tracker</h1>
            <p className="text-gray-600 mt-2">Track your weight, calculate BMI, and monitor PCOS risk factors</p>
          </div>

          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Entry
              </CardTitle>
              <CardDescription>Enter your current weight and height to track your health metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                    required
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    min="1"
                    max="500"
                    placeholder="e.g., 65.5"
                    value={formData.weight}
                    onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    min="50"
                    max="300"
                    placeholder="e.g., 165.5"
                    value={formData.height}
                    onChange={(e) => setFormData((prev) => ({ ...prev, height: e.target.value }))}
                    required
                  />
                </div>
                <div className="md:col-span-3">
                  <Button type="submit" className="w-full">
                    Add Entry
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Latest Results */}
          {latestEntry && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Latest BMI Results
                  </CardTitle>
                  <CardDescription>Your most recent health metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600">{latestEntry.bmi}</div>
                    <div className="text-sm text-gray-500">BMI Score</div>
                  </div>
                  <div className="flex justify-center">
                    <Badge className={getCategoryColor(latestEntry.category)}>{latestEntry.category}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Weight</div>
                      <div className="text-gray-600">{latestEntry.weight} kg</div>
                    </div>
                    <div>
                      <div className="font-medium">Height</div>
                      <div className="text-gray-600">{latestEntry.height} cm</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    PCOS Risk Assessment
                  </CardTitle>
                  <CardDescription>Based on your current BMI</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center">
                    <Badge className={getRiskColor(latestEntry.pcosRisk)}>{latestEntry.pcosRisk}</Badge>
                  </div>
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      {latestEntry.bmi >= 25
                        ? "Higher BMI is associated with increased PCOS risk. Consider consulting a healthcare provider for personalized advice."
                        : "Maintaining a healthy weight can help reduce PCOS risk factors. Continue with healthy lifestyle choices."}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          )}

          {/* BMI Categories Reference */}
          <Card>
            <CardHeader>
              <CardTitle>BMI Categories Reference</CardTitle>
              <CardDescription>Understanding your BMI score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-lg bg-blue-50">
                  <div className="font-semibold text-blue-800">Underweight</div>
                  <div className="text-sm text-blue-600">{"< 18.5"}</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-green-50">
                  <div className="font-semibold text-green-800">Normal</div>
                  <div className="text-sm text-green-600">18.5 - 24.9</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-yellow-50">
                  <div className="font-semibold text-yellow-800">Overweight</div>
                  <div className="text-sm text-yellow-600">25.0 - 29.9</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-red-50">
                  <div className="font-semibold text-red-800">Obese</div>
                  <div className="text-sm text-red-600">{"≥ 30.0"}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PCOS and Weight Education Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Understanding PCOS and Weight Connection
              </CardTitle>
              <CardDescription>Learn how weight affects PCOS risk and symptoms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">What is PCOS?</h4>
                  <p className="text-sm text-gray-600">
                    Polycystic Ovary Syndrome (PCOS) is a hormonal disorder affecting women of reproductive age. It's
                    characterized by irregular periods, excess androgen levels, and polycystic ovaries.
                  </p>
                  <h4 className="font-semibold text-lg">Weight and PCOS Connection</h4>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>60-80% of women with PCOS are overweight or obese</li>
                    <li>Excess weight can worsen insulin resistance</li>
                    <li>Higher BMI increases androgen production</li>
                    <li>Weight gain can trigger PCOS symptoms</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">How Weight Loss Helps</h4>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>5-10% weight loss can improve symptoms significantly</li>
                    <li>Better insulin sensitivity and hormone balance</li>
                    <li>More regular menstrual cycles</li>
                    <li>Reduced risk of diabetes and heart disease</li>
                    <li>Improved fertility outcomes</li>
                  </ul>
                  <Alert>
                    <Heart className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Even modest weight loss can lead to significant improvements in PCOS symptoms and overall health.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personalized Health Tips */}
          {latestEntry && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Personalized Health Tips
                </CardTitle>
                <CardDescription>
                  Customized recommendations based on your BMI: {latestEntry.bmi} ({latestEntry.category})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Exercise Tips */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Dumbbell className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold">Exercise Recommendations</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      {latestEntry.bmi < 18.5 ? (
                        <>
                          <p className="font-medium text-blue-800">Focus on Strength Building:</p>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Resistance training 3-4x per week</li>
                            <li>Compound exercises (squats, deadlifts)</li>
                            <li>Progressive overload training</li>
                            <li>Limit excessive cardio</li>
                          </ul>
                        </>
                      ) : latestEntry.bmi < 25 ? (
                        <>
                          <p className="font-medium text-green-800">Maintain Current Fitness:</p>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>150 minutes moderate cardio weekly</li>
                            <li>Strength training 2-3x per week</li>
                            <li>Mix of HIIT and steady-state cardio</li>
                            <li>Flexibility and mobility work</li>
                          </ul>
                        </>
                      ) : latestEntry.bmi < 30 ? (
                        <>
                          <p className="font-medium text-yellow-800">Focus on Fat Loss:</p>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Combine cardio and strength training</li>
                            <li>HIIT workouts 3x per week</li>
                            <li>Daily walks (8,000-10,000 steps)</li>
                            <li>Circuit training for efficiency</li>
                          </ul>
                        </>
                      ) : (
                        <>
                          <p className="font-medium text-red-800">Start Gradually:</p>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Begin with 20-30 min daily walks</li>
                            <li>Low-impact exercises (swimming, cycling)</li>
                            <li>Bodyweight exercises at home</li>
                            <li>Gradually increase intensity</li>
                          </ul>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Nutrition Tips */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Utensils className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold">Nutrition Guidelines</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      {latestEntry.bmi < 18.5 ? (
                        <>
                          <p className="font-medium text-blue-800">Healthy Weight Gain:</p>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Increase caloric intake by 300-500 calories</li>
                            <li>Focus on nutrient-dense foods</li>
                            <li>Healthy fats: nuts, avocados, olive oil</li>
                            <li>Protein with every meal</li>
                          </ul>
                        </>
                      ) : latestEntry.bmi < 25 ? (
                        <>
                          <p className="font-medium text-green-800">Maintain Balance:</p>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Balanced macronutrients (40% carbs, 30% protein, 30% fat)</li>
                            <li>5-6 servings of fruits and vegetables</li>
                            <li>Whole grains over refined carbs</li>
                            <li>Stay hydrated (8-10 glasses water)</li>
                          </ul>
                        </>
                      ) : (
                        <>
                          <p className="font-medium text-orange-800">PCOS-Friendly Diet:</p>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Low glycemic index foods</li>
                            <li>Reduce refined sugars and processed foods</li>
                            <li>Anti-inflammatory foods (berries, leafy greens)</li>
                            <li>Lean proteins and healthy fats</li>
                            <li>Consider intermittent fasting</li>
                          </ul>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Lifestyle Tips */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Moon className="h-5 w-5 text-purple-600" />
                      <h4 className="font-semibold">Lifestyle & Wellness</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium text-purple-800">General Wellness:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>7-9 hours of quality sleep</li>
                        <li>Stress management (meditation, yoga)</li>
                        <li>Regular meal timing</li>
                        <li>Limit caffeine and alcohol</li>
                      </ul>
                      {latestEntry.bmi >= 25 && (
                        <>
                          <p className="font-medium text-purple-800 mt-3">PCOS-Specific Tips:</p>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Monitor blood sugar levels</li>
                            <li>Consider supplements (inositol, vitamin D)</li>
                            <li>Regular gynecological check-ups</li>
                            <li>Track menstrual cycles</li>
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Plan */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Your 30-Day Action Plan:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Week 1-2: Foundation</p>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Start with 20-30 min daily walks</li>
                        <li>Replace one processed meal with whole foods</li>
                        <li>Establish consistent sleep schedule</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium">Week 3-4: Progress</p>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Add strength training 2x per week</li>
                        <li>Meal prep healthy options</li>
                        <li>Practice stress-reduction techniques</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* History */}
          {entries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Entry History
                </CardTitle>
                <CardDescription>Your previous health tracking entries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {entries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-medium">{entry.date}</div>
                        <div className="text-sm text-gray-600">
                          {entry.weight}kg • {entry.height}cm
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold">BMI: {entry.bmi}</div>
                        <Badge className={getCategoryColor(entry.category)} variant="secondary">
                          {entry.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Disclaimer */}
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Medical Disclaimer:</strong> This tool provides general health information and should not replace
              professional medical advice. PCOS risk assessment is based on BMI correlation studies. Please consult with
              a healthcare provider for accurate diagnosis and personalized treatment plans.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}
