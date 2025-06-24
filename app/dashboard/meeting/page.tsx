"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  MessageSquare,
  Users,
  BarChart2,
  Clock,
  Settings,
  X,
  Maximize2,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Volume2,
  Brain,
  Waves,
} from "lucide-react"
import { LiveParticipants } from "@/components/live-participants"
import { MeetingChat } from "@/components/meeting-chat"
import { LiveEmotionTracker } from "@/components/live-emotion-tracker"
import { MeetingAgenda } from "@/components/meeting-agenda"
import { FaceEmotionDetector } from "@/components/face-emotion-detector"
import { VoiceEmotionDetector } from "@/components/voice-emotion-detector"

interface EmotionData {
  happy: number
  sad: number
  angry: number
  fearful: number
  disgusted: number
  surprised: number
  neutral: number
}

interface VoiceEmotionData {
  emotion: string
  confidence: number
  audioFeatures: {
    pitch: number
    energy: number
    speakingRate: number
    volume: number
    spectralCentroid: number
    zeroCrossingRate: number
  }
}

export default function MeetingPage() {
  const [isMicOn, setIsMicOn] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [showAlert, setShowAlert] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [audioError, setAudioError] = useState<string | null>(null)
  const [cameraStatus, setCameraStatus] = useState<string>("")
  const [audioStatus, setAudioStatus] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [isAudioLoading, setIsAudioLoading] = useState(false)

  // Face detection states
  const [currentFaceEmotions, setCurrentFaceEmotions] = useState<EmotionData | undefined>()
  const [faceDetected, setFaceDetected] = useState(false)

  // Voice detection states
  const [currentVoiceEmotion, setCurrentVoiceEmotion] = useState<VoiceEmotionData | undefined>()
  const [voiceDetectionActive, setVoiceDetectionActive] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  // Combined emotions (face + voice)
  const [combinedEmotions, setCombinedEmotions] = useState<EmotionData | undefined>()

  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const audioStreamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Format elapsed time as mm:ss
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  // Timer for meeting duration
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Show AI alert after 30 seconds
  useEffect(() => {
    if (elapsedTime === 30) {
      setShowAlert(true)
    }
  }, [elapsedTime])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cancel animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }

      // Clean up video stream
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop())
        localStreamRef.current = null
      }

      // Clean up audio stream
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop())
        audioStreamRef.current = null
      }

      // Clean up audio context
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
    }
  }, [])

  // Memoized emotion mapping
  const emotionMapping = useMemo(
    () => ({
      happy: "happy" as keyof EmotionData,
      excited: "happy" as keyof EmotionData,
      calm: "neutral" as keyof EmotionData,
      neutral: "neutral" as keyof EmotionData,
      stressed: "fearful" as keyof EmotionData,
      angry: "angry" as keyof EmotionData,
      sad: "sad" as keyof EmotionData,
      frustrated: "angry" as keyof EmotionData,
    }),
    [],
  )

  // Combine face and voice emotions with useMemo to prevent unnecessary recalculations
  const computedCombinedEmotions = useMemo(() => {
    if (currentFaceEmotions && currentVoiceEmotion) {
      // Weighted combination: 60% face, 40% voice
      const faceWeight = 0.6
      const voiceWeight = 0.4

      // Convert voice emotion to emotion data format
      const voiceEmotionData: EmotionData = {
        happy: 0,
        sad: 0,
        angry: 0,
        fearful: 0,
        disgusted: 0,
        surprised: 0,
        neutral: 0,
      }

      const mappedEmotion = emotionMapping[currentVoiceEmotion.emotion as keyof typeof emotionMapping] || "neutral"
      voiceEmotionData[mappedEmotion] = currentVoiceEmotion.confidence

      // Combine emotions
      return {
        happy: currentFaceEmotions.happy * faceWeight + voiceEmotionData.happy * voiceWeight,
        sad: currentFaceEmotions.sad * faceWeight + voiceEmotionData.sad * voiceWeight,
        angry: currentFaceEmotions.angry * faceWeight + voiceEmotionData.angry * voiceWeight,
        fearful: currentFaceEmotions.fearful * faceWeight + voiceEmotionData.fearful * voiceWeight,
        disgusted: currentFaceEmotions.disgusted * faceWeight + voiceEmotionData.disgusted * voiceWeight,
        surprised: currentFaceEmotions.surprised * faceWeight + voiceEmotionData.surprised * voiceWeight,
        neutral: currentFaceEmotions.neutral * faceWeight + voiceEmotionData.neutral * voiceWeight,
      }
    } else if (currentFaceEmotions) {
      return currentFaceEmotions
    } else if (currentVoiceEmotion) {
      // Use only voice emotion if face is not available
      const voiceOnly: EmotionData = {
        happy: 0,
        sad: 0,
        angry: 0,
        fearful: 0,
        disgusted: 0,
        surprised: 0,
        neutral: 0,
      }

      const mappedEmotion = emotionMapping[currentVoiceEmotion.emotion as keyof typeof emotionMapping] || "neutral"
      voiceOnly[mappedEmotion] = currentVoiceEmotion.confidence

      return voiceOnly
    }
    return undefined
  }, [currentFaceEmotions, currentVoiceEmotion, emotionMapping])

  // Update combined emotions only when computed value changes
  useEffect(() => {
    setCombinedEmotions(computedCombinedEmotions)
  }, [computedCombinedEmotions])

  // Memoized callback functions to prevent unnecessary re-renders
  const handleFaceEmotionDetected = useCallback((emotions: EmotionData) => {
    setCurrentFaceEmotions(emotions)
  }, [])

  const handleFaceDetected = useCallback((detected: boolean) => {
    setFaceDetected(detected)
  }, [])

  const handleVoiceEmotionDetected = useCallback((voiceEmotion: VoiceEmotionData) => {
    setCurrentVoiceEmotion(voiceEmotion)
    console.log("Voice emotion detected:", voiceEmotion)
  }, [])

  const handleSpeakingStateChanged = useCallback((speaking: boolean) => {
    setIsSpeaking(speaking)
  }, [])

  // Audio level monitoring with useCallback and throttling
  const monitorAudioLevel = useCallback(() => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(dataArray)

    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length
    const normalizedLevel = Math.min(100, (average / 128) * 100)

    // Throttle updates to reduce re-renders
    setAudioLevel((prevLevel) => {
      const diff = Math.abs(prevLevel - normalizedLevel)
      return diff > 3 ? Math.round(normalizedLevel) : prevLevel
    })

    animationFrameRef.current = requestAnimationFrame(monitorAudioLevel)
  }, [])

  const startAudio = useCallback(async () => {
    try {
      setIsAudioLoading(true)
      setAudioError(null)
      setAudioStatus("Requesting microphone access...")

      // Clean up existing streams and contexts
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop())
        audioStreamRef.current = null
      }

      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }

      // Cancel any existing animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }

      await new Promise((resolve) => setTimeout(resolve, 300))

      setAudioStatus("Accessing microphone...")

      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
        },
        video: false,
      })

      audioStreamRef.current = audioStream
      setAudioStatus("Setting up audio analysis...")

      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        const source = audioContextRef.current.createMediaStreamSource(audioStream)
        analyserRef.current = audioContextRef.current.createAnalyser()

        analyserRef.current.fftSize = 256
        source.connect(analyserRef.current)

        // Start monitoring after everything is set up
        monitorAudioLevel()
        setAudioStatus("Microphone active - AI voice emotion detection enabled")
        setVoiceDetectionActive(true)
      } catch (audioContextError) {
        console.warn("Audio context setup failed:", audioContextError)
        setAudioStatus("Microphone active (basic mode)")
      }

      setIsMicOn(true)
      setIsAudioLoading(false)
    } catch (err) {
      console.error("Error accessing microphone:", err)
      setIsAudioLoading(false)
      setIsMicOn(false)
      setAudioError(`Audio error: ${err instanceof Error ? err.message : "Unknown error"}`)
    }
  }, [monitorAudioLevel])

  const stopAudio = useCallback(() => {
    setIsAudioLoading(true)
    setAudioStatus("Stopping microphone...")

    // Cancel animation frame first
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    // Clean up audio stream
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop())
      audioStreamRef.current = null
    }

    // Clean up audio context
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    analyserRef.current = null
    setAudioLevel(0)
    setIsMicOn(false)
    setVoiceDetectionActive(false)
    setIsSpeaking(false)
    setCurrentVoiceEmotion(undefined)
    setAudioStatus("")
    setIsAudioLoading(false)
  }, [])

  const combineAudioVideoStreams = useCallback(() => {
    if (!localStreamRef.current || !audioStreamRef.current) return

    try {
      const combinedStream = new MediaStream()

      localStreamRef.current.getVideoTracks().forEach((track) => {
        combinedStream.addTrack(track)
      })

      audioStreamRef.current.getAudioTracks().forEach((track) => {
        combinedStream.addTrack(track)
      })

      if (videoRef.current) {
        videoRef.current.srcObject = combinedStream
      }

      console.log("Combined audio and video streams")
    } catch (err) {
      console.error("Error combining streams:", err)
    }
  }, [])

  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true)
      setCameraError(null)
      setCameraStatus("Initializing camera...")

      if (!videoRef.current) {
        setCameraStatus("Waiting for video element...")
        let attempts = 0
        const maxAttempts = 10

        while (!videoRef.current && attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 500))
          attempts++
        }

        if (!videoRef.current) {
          throw new Error("Video element not found after multiple attempts")
        }
      }

      setCameraStatus("Stopping any existing video streams...")

      if (localStreamRef.current) {
        localStreamRef.current.getVideoTracks().forEach((track) => track.stop())
      }

      await new Promise((resolve) => setTimeout(resolve, 500))

      setCameraStatus("Requesting camera access...")

      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          facingMode: "user",
          frameRate: { ideal: 30 },
        },
        audio: false,
      })

      console.log("Camera stream obtained:", videoStream)
      localStreamRef.current = videoStream

      setCameraStatus("Connecting to video element...")

      videoRef.current.srcObject = videoStream
      videoRef.current.muted = true
      videoRef.current.autoplay = true
      videoRef.current.playsInline = true

      videoRef.current.onloadedmetadata = () => {
        setCameraStatus("Video metadata loaded, starting playback...")

        if (videoRef.current) {
          videoRef.current
            .play()
            .then(() => {
              setCameraStatus("Camera active - AI face emotion detection enabled")
              setIsCameraOn(true)
              setIsLoading(false)

              if (isMicOn && audioStreamRef.current) {
                combineAudioVideoStreams()
              }
            })
            .catch((playErr) => {
              console.error("Error playing video:", playErr)
              setCameraError(`Video playback error: ${playErr.message}`)
              setIsLoading(false)
            })
        }
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setIsLoading(false)
      setIsCameraOn(false)
      setCameraError(`Camera error: ${err instanceof Error ? err.message : "Unknown error"}`)
    }
  }, [isMicOn, combineAudioVideoStreams])

  const stopCamera = useCallback(() => {
    setIsLoading(true)
    setCameraStatus("Stopping camera...")

    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => track.stop())
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    localStreamRef.current = null
    setIsCameraOn(false)
    setFaceDetected(false)
    setCurrentFaceEmotions(undefined)
    setCameraStatus("")
    setIsLoading(false)
  }, [])

  const toggleMicrophone = useCallback(() => {
    if (isMicOn) {
      stopAudio()
    } else {
      startAudio()
    }
  }, [isMicOn, stopAudio, startAudio])

  const toggleCamera = useCallback(() => {
    if (isCameraOn) {
      stopCamera()
    } else {
      startCamera()
    }
  }, [isCameraOn, stopCamera, startCamera])

  // Memoize audio stream to prevent unnecessary re-renders of VoiceEmotionDetector
  const memoizedAudioStream = useMemo(() => audioStreamRef.current, [isMicOn])

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Live Meeting: Frontend Team Daily Scrum</h1>
          <div className="flex items-center text-muted-foreground mt-1">
            <Clock className="mr-1 h-4 w-4" />
            <span>Started at 9:00 AM • Duration: {formatTime(elapsedTime)}</span>
            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 hover:bg-green-100">
              Live
            </Badge>
            {faceDetected && (
              <Badge variant="outline" className="ml-2 bg-purple-50 text-purple-700 hover:bg-purple-100">
                <Brain className="mr-1 h-3 w-3" />
                Face AI
              </Badge>
            )}
            {voiceDetectionActive && (
              <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 hover:bg-blue-100">
                <Waves className="mr-1 h-3 w-3" />
                Voice AI
              </Badge>
            )}
            {isSpeaking && (
              <Badge variant="outline" className="ml-2 bg-orange-50 text-orange-700 hover:bg-orange-100">
                <Volume2 className="mr-1 h-3 w-3" />
                Berbicara
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Pengaturan
          </Button>
          <Button variant="destructive" size="sm">
            <X className="mr-2 h-4 w-4" />
            Akhiri Rapat
          </Button>
        </div>
      </div>

      {/* Status Messages */}
      {cameraStatus && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center">
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse mr-2"></div>
          <span className="text-sm text-blue-700">{cameraStatus}</span>
        </div>
      )}

      {audioStatus && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
          <div className="flex-1 flex items-center justify-between">
            <span className="text-sm text-green-700">{audioStatus}</span>
            {isMicOn && (
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-green-600" />
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className={`${isSpeaking ? "bg-orange-500" : "bg-green-500"} h-2 rounded-full transition-all duration-100`}
                    style={{ width: `${audioLevel}%` }}
                  ></div>
                </div>
                <span className="text-xs text-green-600">{audioLevel}%</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Voice Emotion Status */}
      {currentVoiceEmotion && (
        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <Waves className="h-4 w-4 text-orange-600 mr-2" />
            <span className="text-sm text-orange-700">
              Voice Emotion: <strong className="capitalize">{currentVoiceEmotion.emotion}</strong> (
              {Math.round(currentVoiceEmotion.confidence * 100)}% confidence)
            </span>
          </div>
          <div className="text-xs text-orange-600">
            Pitch: {Math.round(currentVoiceEmotion.audioFeatures.pitch)} | Energy:{" "}
            {Math.round(currentVoiceEmotion.audioFeatures.energy * 100)}%
          </div>
        </div>
      )}

      {/* Error Messages */}
      {cameraError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-red-800">Camera Error</h3>
            <p className="text-sm text-red-700 mb-2">{cameraError}</p>
            <Button size="sm" variant="outline" onClick={startCamera} className="text-red-700 border-red-300">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      )}

      {audioError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-red-800">Microphone Error</h3>
            <p className="text-sm text-red-700 mb-2">{audioError}</p>
            <Button size="sm" variant="outline" onClick={startAudio} className="text-red-700 border-red-300">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      )}

      {showAlert && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-blue-800">AI Suggestion</h3>
            <p className="text-sm text-blue-700 mb-2">
              Team stress levels are rising slightly. Consider taking a short break in the next 5 minutes.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-blue-700 border-blue-300 hover:bg-blue-100"
                onClick={() => setShowAlert(false)}
              >
                Dismiss
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Schedule Break
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Video Section */}
        <div className="xl:col-span-3 space-y-4">
          <Card className="border-2 border-teal-600">
            <CardContent className="p-0">
              <div className="relative bg-black rounded-lg aspect-video overflow-hidden">
                {/* Always render the video element */}
                <video
                  ref={videoRef}
                  className={`w-full h-full object-cover ${isCameraOn ? "block" : "hidden"}`}
                  muted
                  autoPlay
                  playsInline
                  style={{
                    background: "#000",
                    transform: "scaleX(-1)",
                  }}
                />

                {/* Face detection overlay */}
                {isCameraOn && (
                  <FaceEmotionDetector
                    videoRef={videoRef}
                    isActive={isCameraOn}
                    onEmotionDetected={handleFaceEmotionDetected}
                    onFaceDetected={handleFaceDetected}
                  />
                )}

                {/* Voice detection component */}
                {isMicOn && memoizedAudioStream && (
                  <VoiceEmotionDetector
                    audioStream={memoizedAudioStream}
                    isActive={voiceDetectionActive}
                    onEmotionDetected={handleVoiceEmotionDetected}
                    onSpeakingStateChanged={handleSpeakingStateChanged}
                  />
                )}

                {/* Show placeholder when camera is off */}
                {!isCameraOn && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-4">
                    <Avatar className="h-24 w-24">
                      <AvatarFallback className="text-4xl">JD</AvatarFallback>
                    </Avatar>
                    <span className="text-xl">John Doe (You)</span>

                    {isMicOn && (
                      <div className="flex items-center gap-2 bg-black bg-opacity-50 px-3 py-2 rounded-full">
                        <Mic className={`h-4 w-4 ${isSpeaking ? "text-orange-400" : "text-green-400"}`} />
                        <div className="w-16 bg-gray-600 rounded-full h-2">
                          <div
                            className={`${isSpeaking ? "bg-orange-400" : "bg-green-400"} h-2 rounded-full transition-all duration-100`}
                            style={{ width: `${audioLevel}%` }}
                          ></div>
                        </div>
                        {voiceDetectionActive && <Waves className="h-4 w-4 text-blue-400 animate-pulse" />}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button onClick={startCamera} disabled={isLoading} className="bg-teal-600 hover:bg-teal-700">
                        {isLoading ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Starting...
                          </>
                        ) : (
                          <>
                            <Video className="mr-2 h-4 w-4" />
                            Enable Camera
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="text-center text-sm text-gray-300 max-w-md">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Brain className="h-5 w-5" />
                        <Waves className="h-5 w-5" />
                      </div>
                      Multi-modal AI emotion detection: Face + Voice analysis for comprehensive mood tracking
                    </div>
                  </div>
                )}

                {/* Participant thumbnails */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 max-w-[200px]">
                  <div className="w-32 h-20 bg-gray-800 rounded overflow-hidden border-2 border-white relative">
                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">JS</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="absolute bottom-1 left-1 text-white text-xs bg-black bg-opacity-70 px-1 rounded">
                      Jane S.
                    </div>
                  </div>

                  <div className="w-32 h-20 bg-gray-800 rounded overflow-hidden border-2 border-white relative">
                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">MJ</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="absolute bottom-1 left-1 text-white text-xs bg-black bg-opacity-70 px-1 rounded">
                      Mike J.
                    </div>
                  </div>

                  <div className="w-32 h-20 bg-gray-800 rounded overflow-hidden border-2 border-white relative">
                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">SW</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="absolute bottom-1 left-1 text-white text-xs bg-black bg-opacity-70 px-1 rounded">
                      Sarah W.
                    </div>
                  </div>
                </div>

                {/* Meeting controls */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex gap-2 bg-black bg-opacity-70 p-3 rounded-full">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-full relative ${isMicOn ? "text-white hover:bg-white/20" : "bg-red-500 text-white hover:bg-red-600"}`}
                      onClick={toggleMicrophone}
                      disabled={isAudioLoading}
                    >
                      {isAudioLoading ? (
                        <RefreshCw className="h-5 w-5 animate-spin" />
                      ) : isMicOn ? (
                        <>
                          <Mic className="h-5 w-5" />
                          <div
                            className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${isSpeaking ? "bg-orange-400" : "bg-green-400"}`}
                            style={{ opacity: audioLevel > 10 ? 1 : 0.3 }}
                          ></div>
                          {voiceDetectionActive && (
                            <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                          )}
                        </>
                      ) : (
                        <MicOff className="h-5 w-5" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-full relative ${isCameraOn ? "text-white hover:bg-white/20" : "bg-red-500 text-white hover:bg-red-600"}`}
                      onClick={toggleCamera}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <RefreshCw className="h-5 w-5 animate-spin" />
                      ) : isCameraOn ? (
                        <>
                          <Video className="h-5 w-5" />
                          {faceDetected && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-purple-400 animate-pulse"></div>
                          )}
                        </>
                      ) : (
                        <VideoOff className="h-5 w-5" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-full ${isScreenSharing ? "bg-green-500 text-white hover:bg-green-600" : "text-white hover:bg-white/20"}`}
                      onClick={() => setIsScreenSharing(!isScreenSharing)}
                    >
                      <ScreenShare className="h-5 w-5" />
                    </Button>

                    <Separator orientation="vertical" className="h-8 bg-gray-600" />

                    <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/20">
                      <Maximize2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Section */}
          <Tabs defaultValue="emotions">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="emotions" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                <span className="hidden sm:inline">Live Emotions</span>
                <span className="sm:hidden">Emotions</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Team Chat</span>
                <span className="sm:hidden">Chat</span>
              </TabsTrigger>
              <TabsTrigger value="participants" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Participants</span>
                <span className="sm:hidden">People</span>
              </TabsTrigger>
              <TabsTrigger value="agenda" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Agenda</span>
                <span className="sm:hidden">Agenda</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="emotions" className="mt-4">
              <LiveEmotionTracker
                currentUserEmotions={combinedEmotions}
                currentUserFaceDetected={faceDetected || voiceDetectionActive}
              />
            </TabsContent>

            <TabsContent value="chat" className="mt-4">
              <MeetingChat />
            </TabsContent>

            <TabsContent value="participants" className="mt-4">
              <LiveParticipants />
            </TabsContent>

            <TabsContent value="agenda" className="mt-4">
              <MeetingAgenda />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Multi-Modal AI Analysis</CardTitle>
              <CardDescription className="text-sm">Face + Voice emotion detection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center">
                  <Brain className="mr-1 h-4 w-4 text-purple-600" />
                  Face AI
                </span>
                <Badge variant={faceDetected ? "default" : "secondary"} className="text-xs">
                  {faceDetected ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center">
                  <Waves className="mr-1 h-4 w-4 text-blue-600" />
                  Voice AI
                </span>
                <Badge variant={voiceDetectionActive ? "default" : "secondary"} className="text-xs">
                  {voiceDetectionActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              {currentVoiceEmotion && (
                <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                  <div className="font-medium text-blue-800">Current Voice Emotion:</div>
                  <div className="text-blue-700 capitalize">
                    {currentVoiceEmotion.emotion} ({Math.round(currentVoiceEmotion.confidence * 100)}%)
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Team Emotion Summary</CardTitle>
              <CardDescription className="text-sm">Real-time emotional state</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Happy", value: 45, color: "bg-green-500" },
                { label: "Neutral", value: 30, color: "bg-blue-500" },
                { label: "Stressed", value: 15, color: "bg-yellow-500" },
                { label: "Sad", value: 5, color: "bg-gray-500" },
                { label: "Angry", value: 5, color: "bg-red-500" },
              ].map((emotion) => (
                <div key={emotion.label} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{emotion.label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-12 bg-gray-200 rounded-full h-2">
                      <div className={`${emotion.color} h-2 rounded-full`} style={{ width: `${emotion.value}%` }}></div>
                    </div>
                    <span className="text-xs w-8 text-right">{emotion.value}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">AI Insights</CardTitle>
              <CardDescription className="text-sm">Based on multi-modal analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-700">
                  Team mood is generally positive. Good time to discuss challenging topics.
                </p>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-700">
                  Mike shows signs of stress when discussing the API integration.
                </p>
              </div>
              {(faceDetected || voiceDetectionActive) && combinedEmotions && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-xs text-purple-700">
                    🤖 Your combined emotion:{" "}
                    {
                      Object.entries(combinedEmotions).reduce((a, b) =>
                        combinedEmotions[a[0] as keyof EmotionData] > combinedEmotions[b[0] as keyof EmotionData]
                          ? a
                          : b,
                      )[0]
                    }{" "}
                    (
                    {Math.round(
                      Object.entries(combinedEmotions).reduce((a, b) =>
                        combinedEmotions[a[0] as keyof EmotionData] > combinedEmotions[b[0] as keyof EmotionData]
                          ? a
                          : b,
                      )[1] * 100,
                    )}
                    %)
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Suggested Actions</CardTitle>
              <CardDescription className="text-sm">Improve team dynamics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 max-h-48 overflow-y-auto">
              {["Take a 2-minute break", "Check in with Mike about API issues", "Acknowledge team progress"].map(
                (action, index) => (
                  <Button key={index} variant="outline" size="sm" className="w-full justify-start text-xs h-8">
                    <ChevronRight className="mr-2 h-3 w-3" />
                    {action}
                  </Button>
                ),
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
