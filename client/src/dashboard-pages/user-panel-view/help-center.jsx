/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react"
import { Search, ChevronRight, ArrowLeft, Clock, ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { categories } from "../../utils/user-panel-states/help-center-states"

const HelpCenter = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [selectedFilters, setSelectedFilters] = useState(["All"])
  const [showSearchResults, setShowSearchResults] = useState(false)

  const allTopics = categories.flatMap((cat) => cat.topics)

  const filteredTopics = searchQuery.trim()
    ? allTopics.filter(
        (topic) =>
          topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.content.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : []

  const categoryTopics = selectedCategory ? categories.find((cat) => cat.id === selectedCategory)?.topics || [] : []

  const filters = ["All", "Recently Updated", "Most Popular", "Trending"]
  
  // Filter categories based on selected filters
  const filteredCategories = selectedFilters.includes("All") 
    ? categories 
    : categories.filter(cat => 
        selectedFilters.some(filter => 
          cat.topics.some(topic => topic.tags?.includes(filter.toLowerCase().replace(" ", "_")))
        )
      )

  const featuredArticles = allTopics.slice(0, 6)

  // Filter handling functions
  const handleFilterClick = (filter) => {
    if (filter === "All") {
      setSelectedFilters(["All"])
    } else {
      const newFilters = selectedFilters.includes("All")
        ? [filter]
        : selectedFilters.includes(filter)
          ? selectedFilters.filter(f => f !== filter)
          : [...selectedFilters, filter]

      setSelectedFilters(newFilters.length === 0 ? ["All"] : newFilters)
    }
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setShowSearchResults(e.target.value.trim().length > 0)
  }

  const handleSearchFocus = () => {
    if (searchQuery.trim().length > 0) {
      setShowSearchResults(true)
    }
  }

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic)
    setShowSearchResults(false)
    setSearchQuery("")
    // Find and set the category for the selected topic
    const topicCategory = categories.find(cat => 
      cat.topics.some(t => t.id === topic.id)
    )
    if (topicCategory) {
      setSelectedCategory(topicCategory.id)
    }
  }

  const handleBackToCategories = () => {
    setSelectedTopic(null)
    setSelectedCategory(null)
  }

  const handleBackToCategory = () => {
    setSelectedTopic(null)
  }

  const renderContent = () => {
    if (selectedTopic) {
      const category = categories.find(c => c.id === selectedCategory)
      return (
        <TopicView
          topic={selectedTopic}
          onBack={handleBackToCategory}
          category={category}
          categoryTopics={categoryTopics}
          onSelectTopic={handleSelectTopic}
          onNavigateToTickets={() => navigate('/dashboard/tickets')}
        />
      )
    }

    if (selectedCategory) {
      const category = categories.find(c => c.id === selectedCategory)
      return (
        <CategoryView
          category={category}
          categories={categories}
          onSelectCategory={setSelectedCategory}
          onSelectTopic={handleSelectTopic}
          onBack={() => setSelectedCategory(null)}
        />
      )
    }

    return (
      <div className="w-full">
        {/* Header Section */}
        <div className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-8">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white text-center mb-4 sm:mb-6">
            Help Center
          </h1>

          {/* Search Bar - Styled like leads.jsx */}
          <div className="relative w-full max-w-7xl mx-auto mb-6 sm:mb-8 px-2">
            <h2 className="text-lg sm:text-xl text-gray-300 text-center mb-4">
              How can we help you?
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search our help center..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                className="w-full bg-[#141414] outline-none text-sm text-white rounded-xl px-4 py-2 pl-9 sm:pl-10 border border-[#333333] focus:border-[#3F74FF] transition-colors"
              />
            </div>

            {showSearchResults && filteredTopics.length > 0 && (
              <div className="absolute top-full left-2 right-2 mt-2 bg-[#1C1C1C] border border-[#333333] rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
                {filteredTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleSelectTopic(topic)}
                    className="w-full text-left px-4 py-3 hover:bg-[#2A2A2A] border-b border-[#333333] last:border-b-0 transition-colors first:rounded-t-xl last:rounded-b-xl"
                  >
                    <p className="font-medium text-white text-sm">{topic.title}</p>
                    <p className="text-gray-400 text-xs mt-1">{topic.category}</p>
                  </button>
                ))}
              </div>
            )}

            {showSearchResults && searchQuery.trim() && filteredTopics.length === 0 && (
              <div className="absolute top-full left-2 right-2 mt-2 bg-[#1C1C1C] border border-[#333333] rounded-xl shadow-lg z-50 p-4">
                <p className="text-gray-400 text-sm text-center">No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>

          {/* Filters Section */}
          <div className="w-full max-w-7xl mx-auto px-2 mb-8">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterClick(filter)}
                  className={`px-4 py-2 rounded-xl cursor-pointer text-sm font-medium transition-colors ${
                    selectedFilters.includes(filter)
                      ? "bg-blue-600 text-white"
                      : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col px-4 sm:px-8 pb-8">
          <div className="w-full max-w-7xl mx-auto flex flex-col space-y-12">

            {/* Featured Section - Minimalist */}
            <div className="mb-12 sm:mb-16">
              <div className="flex items-center gap-2 mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  Featured & Frequently Read Articles
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {featuredArticles.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => handleSelectTopic(article)}
                    className="text-left bg-[#161616] p-4 rounded-lg border border-gray-700 hover:bg-[#1F1F1F] hover:border-blue-500/50 transition-all group"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors line-clamp-2 text-sm">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-2 text-gray-500 text-xs">
                          <span>{article.category}</span>
                          <span>•</span>
                          <span>3 min read</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Categories Section */}
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-6 sm:mb-8">
                Browse All Categories
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className="text-left bg-[#161616] p-6 sm:p-7 rounded-xl border border-gray-700 hover:bg-[#1F1F1F] hover:border-blue-500/50 transition-all group"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Orange Tag */}
                        <span className="inline-block bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded mb-3 whitespace-nowrap">
                          {category.name}
                        </span>
                        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{category.description}</p>
                        {/* Article count */}
                        <p className="text-gray-500 text-xs mt-3">{category.topics?.length || 0} articles</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer - Contact Section */}
            <div className="mt-12 pt-8 border-t border-gray-700">
              <p className="text-center text-gray-400 text-sm sm:text-base">
                Not finding what you are looking for?
              </p>
              <p className="text-center text-gray-500 text-sm mt-1">
                Chat with us or send us an email.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen rounded-3xl bg-[#1C1C1C] text-white">
      {renderContent()}
    </div>
  )
}

// Category View Component
const CategoryView = ({ category, categories, onSelectCategory, onSelectTopic, onBack }) => {
  const [hoveredTopicId, setHoveredTopicId] = useState(null)

  return (
    <>
      <div className="flex-shrink-0 pt-8 sm:pt-12 lg:pt-16 pb-6 sm:pb-8 px-4 sm:px-8">
        <div className="w-full max-w-7xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium mb-4 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg text-gray-300">Articles on:</span>
            {/* Orange Tag */}
            <span className="inline-block bg-orange-500 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded">
              {category.name}
            </span>
          </div>
          <p className="text-gray-400 text-sm sm:text-base">{category.description}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-4 sm:px-8 pb-8">
        <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <h3 className="font-bold text-white mb-4 text-sm sm:text-base">Categories</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`w-full text-left px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                    cat.id === category.id
                      ? "bg-blue-600/20 text-blue-400 border border-blue-600/30"
                      : "text-gray-300 hover:bg-[#2A2A2A] border border-transparent"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Topics List */}
          <div className="lg:col-span-3">
            <div className="space-y-3 sm:space-y-4">
              {category.topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => onSelectTopic(topic)}
                  onMouseEnter={() => setHoveredTopicId(topic.id)}
                  onMouseLeave={() => setHoveredTopicId(null)}
                  className="w-full text-left bg-[#161616] p-4 sm:p-5 rounded-xl border border-gray-700 hover:bg-[#1F1F1F] hover:border-blue-500/50 transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors text-sm sm:text-base">
                        {topic.title}
                      </h4>
                      <p className="text-gray-400 text-xs sm:text-sm mt-2 line-clamp-2">{topic.content}</p>
                      {/* Reading time */}
                      <div className="flex items-center gap-1 mt-3 text-gray-500 text-xs">
                        <Clock size={12} />
                        <span>3 min read</span>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform group-hover:text-blue-400 ${
                        hoveredTopicId === topic.id ? "translate-x-1" : ""
                      }`}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Topic View Component
const TopicView = ({ topic, onBack, category, categoryTopics, onSelectTopic, onNavigateToTickets }) => {
  const [feedback, setFeedback] = useState(null) // 'helpful' | 'not-helpful' | null
  const currentIndex = categoryTopics.findIndex((t) => t.id === topic.id)
  const previousTopic = currentIndex > 0 ? categoryTopics[currentIndex - 1] : null
  const nextTopic = currentIndex < categoryTopics.length - 1 ? categoryTopics[currentIndex + 1] : null

  const handleFeedback = (type) => {
    setFeedback(type)
  }

  return (
    <>
      <div className="flex-shrink-0 pt-8 sm:pt-12 lg:pt-16 pb-6 sm:pb-8 px-4 sm:px-8">
        <div className="w-full max-w-7xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium mb-4 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {category?.name || "Category"}
          </button>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
            <span className="text-gray-400 text-sm">Articles on:</span>
            {/* Orange Tag */}
            <span className="inline-block bg-orange-500 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded">
              {topic.category}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-4 sm:px-8 pb-8">
        <div className="w-full max-w-7xl mx-auto space-y-8">
          {/* Article Content */}
          <div className="bg-[#161616] rounded-xl p-6 sm:p-8 lg:p-10 border border-gray-700">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
              {topic.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-8 sm:mb-10 pb-8 sm:pb-10 border-b border-gray-700 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>3 min read</span>
              </div>
              <div>
                <span className="font-medium">Last updated:</span> {topic.updatedDate}
              </div>
              <div>
                <span className="font-medium">Time:</span> {topic.updatedTime}
              </div>
            </div>

            <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
              <p className="text-gray-300 leading-relaxed text-base sm:text-lg mb-6">
                {topic.content}
              </p>
              <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                Follow the instructions carefully to resolve your issue. If you need additional help, please contact our
                customer support team through the chat option.
              </p>
            </div>

            {/* Feedback Section with Navigation */}
            <div className="mt-10 pt-8 border-t border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                {/* Left: Feedback */}
                <div>
                  <p className="text-gray-300 text-sm mb-4">Was this article helpful?</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleFeedback('helpful')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        feedback === 'helpful'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A] border border-transparent'
                      }`}
                    >
                      <ThumbsUp size={16} />
                      Yes
                    </button>
                    <button
                      onClick={() => handleFeedback('not-helpful')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        feedback === 'not-helpful'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A] border border-transparent'
                      }`}
                    >
                      <ThumbsDown size={16} />
                      No
                    </button>
                  </div>
                  {feedback && (
                    <p className="text-gray-500 text-xs mt-3">
                      {feedback === 'helpful' 
                        ? 'Thanks for your feedback!' 
                        : 'Sorry to hear that. Consider contacting support for more help.'}
                    </p>
                  )}
                </div>

                {/* Right: Navigation */}
                <div className="flex items-center gap-3">
                  {previousTopic && (
                    <button
                      onClick={() => onSelectTopic(previousTopic)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-[#2A2A2A] hover:bg-[#3A3A3A] rounded-xl text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      <ArrowLeft size={16} />
                      Previous
                    </button>
                  )}
                  {nextTopic && (
                    <button
                      onClick={() => onSelectTopic(nextTopic)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-white transition-colors text-sm"
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Still need help - New Section */}
          <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/10 border border-blue-600/30 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Still need help?</h3>
                <p className="text-gray-400 text-sm">Our support team is ready to assist you</p>
              </div>
            </div>
            <button 
              onClick={onNavigateToTickets}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default HelpCenter
