/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react"
import { Search, ChevronRight, ArrowLeft } from "react-feather"
import { categories } from "../../utils/user-panel-states/help-center-states"

const HelpCenter = () => {
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
        <div className="pt-8 sm:pt-12 lg:pt-16 pb-6 sm:pb-8 px-4 sm:px-8">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white text-center mb-8 sm:mb-12 lg:mb-16">
            Help Center
          </h1>

          <div className="relative w-full max-w-7xl mx-auto mb-6 sm:mb-8 px-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <input
                type="search"
                placeholder="Search our help center..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                className="h-11 bg-[#181818] text-white rounded-xl pl-12 pr-4 w-full text-sm outline-none border border-[#333333] focus:border-[#3F74FF] leading-none"
              />
            </div>

            {showSearchResults && filteredTopics.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#2A2A2A] border border-gray-600 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                {filteredTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleSelectTopic(topic)}
                    className="w-full text-left px-4 py-3 hover:bg-[#3A3A3A] border-b border-gray-600 last:border-b-0 transition-colors"
                  >
                    <p className="font-medium text-white text-sm">{topic.title}</p>
                    <p className="text-gray-400 text-xs mt-1">{topic.category}</p>
                  </button>
                ))}
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
            {/* Featured Section */}
            <div className="mb-12 sm:mb-16">
              <div className="flex items-center gap-2 mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  Featured & Frequently Read Articles
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {featuredArticles.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => handleSelectTopic(article)}
                    className="text-left bg-[#161616] p-5 sm:p-6 rounded-lg border border-gray-700 hover:bg-[#1F1F1F] hover:border-gray-600 transition-all group"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <span className="inline-block bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded mb-3">
                          {article.category}
                        </span>
                        <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-3 text-sm sm:text-base">
                          {article.title}
                        </h3>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1 group-hover:text-blue-400 transition-colors" />
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
                    className="text-left bg-[#161616] p-6 sm:p-7 rounded-lg border border-gray-700 hover:bg-[#1F1F1F] hover:border-gray-600 transition-all group"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <span className="inline-block bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded mb-3 whitespace-nowrap">
                          {category.name}
                        </span>
                        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{category.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
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
            <span className="inline-block bg-blue-600 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded">
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
                  className="w-full text-left bg-[#161616] p-4 sm:p-5 rounded-lg border border-gray-700 hover:bg-[#1F1F1F] hover:border-gray-600 transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors text-sm sm:text-base">
                        {topic.title}
                      </h4>
                      <p className="text-gray-400 text-xs sm:text-sm mt-2 line-clamp-2">{topic.content}</p>
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
const TopicView = ({ topic, onBack, category, categoryTopics, onSelectTopic }) => {
  const currentIndex = categoryTopics.findIndex((t) => t.id === topic.id)
  const previousTopic = currentIndex > 0 ? categoryTopics[currentIndex - 1] : null
  const nextTopic = currentIndex < categoryTopics.length - 1 ? categoryTopics[currentIndex + 1] : null

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
            <span className="inline-block bg-blue-600 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded">
              {topic.category}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-4 sm:px-8 pb-8">
        <div className="w-full max-w-7xl mx-auto space-y-8">
          {/* Article Content */}
          <div className="bg-[#161616] rounded-lg p-6 sm:p-8 lg:p-10 border border-gray-700">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
              {topic.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-8 sm:mb-10 pb-8 sm:pb-10 border-b border-gray-700 text-sm text-gray-400">
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
          </div>

          {/* Navigation Buttons */}
          {(previousTopic || nextTopic) && (
            <div className="grid sm:grid-cols-2 gap-4 mt-8 sm:mt-12">
              {previousTopic && (
                <button
                  onClick={() => onSelectTopic(previousTopic)}
                  className="text-left bg-[#161616] p-5 sm:p-6 rounded-lg border border-gray-700 hover:bg-[#1F1F1F] hover:border-gray-600 transition-all group"
                >
                  <p className="text-gray-400 text-xs sm:text-sm mb-2">Previous</p>
                  <p className="font-semibold text-white group-hover:text-blue-400 line-clamp-2 text-sm sm:text-base">
                    {previousTopic.title}
                  </p>
                </button>
              )}
              {nextTopic && (
                <button
                  onClick={() => onSelectTopic(nextTopic)}
                  className="text-left bg-[#161616] p-5 sm:p-6 rounded-lg border border-gray-700 hover:bg-[#1F1F1F] hover:border-gray-600 transition-all group sm:col-start-2"
                >
                  <p className="text-gray-400 text-xs sm:text-sm mb-2">Next</p>
                  <p className="font-semibold text-white group-hover:text-blue-400 line-clamp-2 text-sm sm:text-base">
                    {nextTopic.title}
                  </p>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default HelpCenter