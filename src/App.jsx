import { useState } from "react";
import { Shield, ShieldAlert, Loader2, CheckCircle, AlertTriangle } from "lucide-react";

function App() {
  const [productName, setProductName] = useState("");
  const [review, setReview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeReview = async () => {
    if (!review.trim() || !productName.trim()) return;
    
    // Check if API key is available
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setResult({
        label: "Error",
        confidence: 0,
        reasons: ["Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file"],
        product_relevance: "Unknown"
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are ZeroLeak – an AI system that detects fake product reviews.

Task:
Analyze the following review text for the product "${productName}" and decide if it is a "Genuine Review" or a "Fake / Suspicious Review".

Consider the following factors:
1. Review relevance to the specific product
2. Language patterns and authenticity
3. Emotional tone and specificity
4. Technical details mentioned
5. Overall credibility indicators

Instructions:
- Output ONLY in valid JSON format, nothing else.
- JSON fields:
  {
    "label": "Genuine" or "Fake",
    "confidence": 0.0–1.0,
    "reasons": ["short, clear bullet points explaining why"],
    "product_relevance": "High/Medium/Low - how relevant is this review to the product"
  }

Product: ${productName}
Review:
${review}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      
      // Clean the response text to handle markdown code blocks
      let cleanedText = text.trim();
      
      // Remove markdown code block markers if present
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      // Remove any leading/trailing whitespace
      cleanedText = cleanedText.trim();
      
      try {
        const parsed = JSON.parse(cleanedText);
        setResult(parsed);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.error("Raw response:", text);
        console.error("Cleaned text:", cleanedText);
        setResult({
          label: "Error",
          confidence: 0,
          reasons: ["Failed to parse AI response. The AI returned invalid JSON format."],
          product_relevance: "Unknown"
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setResult({
        label: "Error",
        confidence: 0,
        reasons: [`Analysis failed: ${error.message}`],
        product_relevance: "Unknown"
      });
    } finally {
      setLoading(false);
    }
  };

  const getResultIcon = () => {
    if (result?.label === "Genuine") return <CheckCircle className="w-8 h-8 text-green-400" />;
    if (result?.label === "Fake") return <ShieldAlert className="w-8 h-8 text-red-400" />;
    return <AlertTriangle className="w-8 h-8 text-yellow-400" />;
  };

  const getResultColor = () => {
    if (result?.label === "Genuine") return "border-green-400 bg-green-900/20";
    if (result?.label === "Fake") return "border-red-400 bg-red-900/20";
    return "border-yellow-400 bg-yellow-900/20";
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return "text-green-400";
    if (confidence >= 0.6) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-50">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
            AuthenticEye
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
            Advanced AI-powered fake review detection. Enter a product name and paste a review to discover if it's genuine or suspicious for that specific product.
          </p>
        </div>

        {/* Main card */}
        <div className="w-full max-w-2xl">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
            {/* Input section */}
            <div className="mb-6 space-y-6">
              {/* Product Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-3">
                  Product Name
                </label>
                <input
                  type="text"
                  className="w-full p-4 rounded-2xl bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter product name (e.g., iPhone 15 Pro, Samsung Galaxy Buds, Nike Air Max...)"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              {/* Review Text Input */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-3">
                  Product Review Text
                </label>
                <div className="relative">
                  <textarea
                    className="w-full p-4 rounded-2xl bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                    rows={6}
                    placeholder="Paste the review text here... For example: 'This product is amazing! I love it so much and would definitely recommend it to everyone. Five stars!'"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                    {review.length} characters
                  </div>
                </div>
              </div>
            </div>

            {/* Analyze button */}
            <button
              onClick={analyzeReview}
              disabled={loading || !review.trim() || !productName.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing Review...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Analyze Review</span>
                </>
              )}
            </button>
          </div>

          {/* Results section */}
          {result && (
            <div className={`mt-8 rounded-3xl p-8 shadow-2xl border-2 backdrop-blur-md ${getResultColor()}`}>
              <div className="flex items-center space-x-4 mb-6">
                {getResultIcon()}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-3xl font-bold text-white">
                      {result.label === "Genuine" ? "Genuine Review" : 
                       result.label === "Fake" ? "Fake Review Detected" : "Analysis Error"}
                    </h2>
                    {productName && (
                      <span className="bg-blue-600/30 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                        {productName}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-gray-300">Confidence:</span>
                    <span className={`font-bold text-xl ${getConfidenceColor(result.confidence)}`}>
                      {(result.confidence * 100).toFixed(1)}%
                    </span>
                    <div className="flex-1 bg-gray-700 rounded-full h-2 ml-2 max-w-32">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          result.confidence >= 0.8 ? 'bg-green-400' :
                          result.confidence >= 0.6 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${result.confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  {result.product_relevance && (
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-gray-300 text-sm">Product Relevance:</span>
                      <span className={`text-sm font-medium ${
                        result.product_relevance === 'High' ? 'text-green-400' :
                        result.product_relevance === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {result.product_relevance}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {result.reasons && result.reasons.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Analysis Details
                  </h3>
                  <div className="space-y-3">
                    {result.reasons.map((reason, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-black/20 rounded-xl">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-200 leading-relaxed">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            Powered by AI • Helping you identify suspicious reviews
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;