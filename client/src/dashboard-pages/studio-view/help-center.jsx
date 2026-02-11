/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react"
import { Search, ChevronRight, ArrowLeft, Clock, ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { categories } from "../../utils/studio-states/help-center-states"

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
          <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-content-primary text-center mb-4 sm:mb-6 oxanium_font">
            Help Center
          </h1>

          {/* Search Bar */}
          <div className="relative w-full max-w-7xl mx-auto mb-6 sm:mb-8 px-2">
            <h2 className="text-lg sm:text-xl text-content-secondary text-center mb-4 open_sans_font">
              How can we help you?
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-content-faint" size={16} />
              <input
                type="text"
                placeholder="Search our help center..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                className="w-full bg-surface-card outline-none text-sm text-content-primary rounded-xl px-4 py-2 pl-9 sm:pl-10 border border-border focus:border-primary transition-colors placeholder-content-faint"
              />
            </div>

            {showSearchResults && filteredTopics.length > 0 && (
              <div className="absolute top-full left-2 right-2 mt-2 bg-surface-hover border border-border rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
                {filteredTopics.map((topic) => {
                  const isFirst = filteredTopics.indexOf(topic) === 0;
                  const isLast = filteredTopics.indexOf(topic) === filteredTopics.length - 1;
                  const roundedClasses = isFirst ? 'first:rounded-t-xl' : isLast ? 'last:rounded-b-xl' : '';
                  
                  return (
                    <button
                      key={topic.id}
                      onClick={() => handleSelectTopic(topic)}
                      className={`w-full text-left px-4 py-3 hover:bg-surface-hover/80 border-b border-border last:border-b-0 transition-colors ${roundedClasses}`}
                    >
                      <p className="font-medium text-content-primary text-sm open_sans_font">{topic.title}</p>
                      <p className="text-content-faint text-xs mt-1">{topic.category}</p>
                    </button>
                  );
                })}
              </div>
            )}

            {showSearchResults && searchQuery.trim() && filteredTopics.length === 0 && (
              <div className="absolute top-full left-2 right-2 mt-2 bg-surface-hover border border-border rounded-xl shadow-lg z-50 p-4">
                <p className="text-content-faint text-sm text-center">No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>

          {/* Filters Section */}
          <div className="w-full max-w-7xl mx-auto px-2 mb-8">
            <div className="flex flex-wrap gap-1.5 sm:gap-3">
              {filters.map((filter) => {
                const isSelected = selectedFilters.includes(filter);
                const buttonClasses = isSelected
                  ? "bg-primary text-white"
                  : "bg-surface-button text-content-secondary hover:bg-surface-button-hover";
                
                return (
                  <button
                    key={filter}
                    onClick={() => handleFilterClick(filter)}
                    className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${buttonClasses}`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col px-4 sm:px-8 pb-8">
          <div className="w-full max-w-7xl mx-auto flex flex-col space-y-12">

            {/* Featured Section */}
            <div className="mb-12 sm:mb-16">
              <div className="flex items-center gap-2 mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-content-primary oxanium_font">
                  Featured & Frequently Read Articles
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {featuredArticles.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => handleSelectTopic(article)}
                    className="text-left bg-surface-card p-4 rounded-lg border border-border-subtle hover:bg-surface-hover hover:border-primary/50 transition-all group"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-content-primary group-hover:text-primary transition-colors line-clamp-2 text-sm open_sans_font">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-2 text-content-faint text-xs">
                          <span>{article.category}</span>
                          <span>•</span>
                          <span>3 min read</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-content-faint flex-shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Categories Section */}
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-content-primary mb-6 sm:mb-8 oxanium_font">
                Browse All Categories
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className="text-left bg-surface-card p-6 sm:p-7 rounded-xl border border-border-subtle hover:bg-surface-hover hover:border-primary/50 transition-all group"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Primary Tag - Orange */}
                        <span className="inline-block bg-primary text-white text-xs font-bold px-2 py-1 rounded mb-3 whitespace-nowrap">
                          {category.name}
                        </span>
                        <p className="text-content-secondary text-sm sm:text-base leading-relaxed open_sans_font">
                          {category.description}
                        </p>
                        {/* Article count */}
                        <p className="text-content-faint text-xs mt-3">{category.topics?.length || 0} articles</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-content-faint flex-shrink-0 mt-1 group-hover:text-primary transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer - Contact Section */}
            <div className="mt-12 pt-8 border-t border-border-subtle">
              <p className="text-center text-content-secondary text-sm sm:text-base open_sans_font">
                Not finding what you are looking for?
              </p>
              <p className="text-center text-content-faint text-sm mt-1">
                Chat with us or send us an email.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen rounded-3xl bg-surface-base text-content-primary">
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
            className="flex items-center gap-2 text-primary hover:text-primary-hover font-medium mb-4 text-sm sm:text-base transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg text-content-secondary open_sans_font">Articles on:</span>
            {/* Primary Tag - Orange */}
            <span className="inline-block bg-primary text-white text-xs sm:text-sm font-bold px-3 py-1 rounded">
              {category.name}
            </span>
          </div>
          <p className="text-content-secondary text-sm sm:text-base open_sans_font">{category.description}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-4 sm:px-8 pb-8">
        <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <h3 className="font-bold text-content-primary mb-4 text-sm sm:text-base oxanium_font">Categories</h3>
            <div className="space-y-2">
              {categories.map((cat) => {
                const isSelected = cat.id === category.id;
                const buttonClasses = isSelected
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-content-secondary hover:bg-surface-hover border border-transparent";
                
                return (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors ${buttonClasses}`}
                  >
                    {cat.name}
                  </button>
                );
              })}
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
                  className="w-full text-left bg-surface-card p-4 sm:p-5 rounded-xl border border-border-subtle hover:bg-surface-hover hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-content-primary group-hover:text-primary transition-colors text-sm sm:text-base open_sans_font">
                        {topic.title}
                      </h4>
                      <p className="text-content-secondary text-xs sm:text-sm mt-2 line-clamp-2 open_sans_font">
                        {topic.content}
                      </p>
                      {/* Reading time */}
                      <div className="flex items-center gap-1 mt-3 text-content-faint text-xs">
                        <Clock size={12} />
                        <span>3 min read</span>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 text-content-faint flex-shrink-0 transition-all group-hover:text-primary ${
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
            className="flex items-center gap-2 text-primary hover:text-primary-hover font-medium mb-4 text-sm sm:text-base transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {category?.name || "Category"}
          </button>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
            <span className="text-content-secondary text-sm">Articles on:</span>
            {/* Primary Tag - Orange */}
            <span className="inline-block bg-primary text-white text-xs sm:text-sm font-bold px-3 py-1 rounded">
              {topic.category}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-4 sm:px-8 pb-8">
        <div className="w-full max-w-7xl mx-auto space-y-8">
          {/* Article Content */}
          <div className="bg-surface-card rounded-xl p-6 sm:p-8 lg:p-10 border border-border-subtle">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-content-primary mb-4 sm:mb-6 oxanium_font">
              {topic.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-8 sm:mb-10 pb-8 sm:pb-10 border-b border-border-subtle text-sm text-content-faint">
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>3 min read</span>
              </div>
              <div>
                <span className="font-medium text-content-secondary">Last updated:</span> {topic.updatedDate}
              </div>
              <div>
                <span className="font-medium text-content-secondary">Time:</span> {topic.updatedTime}
              </div>
            </div>

            <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
              <p className="text-content-secondary leading-relaxed text-base sm:text-lg mb-6 open_sans_font">
                {topic.content}
              </p>
              <p className="text-content-secondary leading-relaxed text-base sm:text-lg open_sans_font">
                Follow the instructions carefully to resolve your issue. If you need additional help, please contact our
                customer support team through the chat option.
              </p>
            </div>

            {/* Feedback Section with Navigation */}
            <div className="mt-10 pt-8 border-t border-border-subtle">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                {/* Left: Feedback */}
                <div>
                  <p className="text-content-secondary text-sm mb-4">Was this article helpful?</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleFeedback('helpful')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        feedback === 'helpful'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-surface-button text-content-secondary hover:bg-surface-button-hover border border-transparent'
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
                          : 'bg-surface-button text-content-secondary hover:bg-surface-button-hover border border-transparent'
                      }`}
                    >
                      <ThumbsDown size={16} />
                      No
                    </button>
                  </div>
                  {feedback && (
                    <p className="text-content-faint text-xs mt-3">
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
                      className="flex items-center gap-2 px-4 py-2.5 bg-surface-button hover:bg-surface-button-hover rounded-xl text-content-secondary hover:text-content-primary transition-colors text-sm"
                    >
                      <ArrowLeft size={16} />
                      Previous
                    </button>
                  )}
                  {nextTopic && (
                    <button
                      onClick={() => onSelectTopic(nextTopic)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover rounded-xl text-white transition-colors text-sm"
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
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-content-primary font-semibold oxanium_font">Still need help?</h3>
                <p className="text-content-secondary text-sm open_sans_font">Our support team is ready to assist you</p>
              </div>
            </div>
            <button 
              onClick={onNavigateToTickets}
              className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-colors"
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