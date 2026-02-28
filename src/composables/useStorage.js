import { ref, watch } from 'vue'

// 存储键名
const STORAGE_KEYS = {
  HISTORY: 'ai_marketing_history',
  FAVORITES: 'ai_marketing_favorites',
  ARTICLES: 'ai_marketing_articles',
  COMMENTS: 'ai_marketing_comments',
  FEEDBACKS: 'ai_marketing_feedbacks',
  VIDEOS: 'ai_marketing_videos',
  TOPICS: 'ai_marketing_topics'
}

// 解析 JSON，失败返回默认值
function parseJSON(value, defaultValue = []) {
  try {
    return JSON.parse(value) || defaultValue
  } catch {
    return defaultValue
  }
}

// 获取历史记录
export function getHistory() {
  const data = localStorage.getItem(STORAGE_KEYS.HISTORY)
  return parseJSON(data, [])
}

// 保存历史记录
export function saveHistory(history) {
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history))
}

// 获取收藏列表
export function getFavorites() {
  const data = localStorage.getItem(STORAGE_KEYS.FAVORITES)
  return parseJSON(data, [])
}

// 保存收藏列表
export function saveFavorites(favorites) {
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites))
}

// 生成唯一ID
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 添加历史记录
export function addHistory(item) {
  const history = getHistory()
  const newItem = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    ...item
  }
  history.unshift(newItem)
  // 最多保留100条记录
  if (history.length > 100) {
    history.pop()
  }
  saveHistory(history)
  return newItem
}

// 删除历史记录
export function deleteHistory(id) {
  const history = getHistory()
  const index = history.findIndex(item => item.id === id)
  if (index > -1) {
    history.splice(index, 1)
    saveHistory(history)
  }
  return history
}

// 添加收藏
export function addFavorite(item) {
  const favorites = getFavorites()
  const exists = favorites.some(f => f.id === item.id)
  if (!exists) {
    favorites.unshift({
      ...item,
      favoriteAt: new Date().toISOString()
    })
    saveFavorites(favorites)
  }
  return favorites
}

// 移除收藏
export function removeFavorite(id) {
  const favorites = getFavorites()
  const index = favorites.findIndex(f => f.id === id)
  if (index > -1) {
    favorites.splice(index, 1)
    saveFavorites(favorites)
  }
  return favorites
}

// 检查是否已收藏
export function isFavorite(id) {
  const favorites = getFavorites()
  return favorites.some(f => f.id === id)
}

// 清空历史记录
export function clearHistory() {
  saveHistory([])
}

// ============ 文章相关函数 ============

// 获取文章列表
export function getArticles() {
  const data = localStorage.getItem(STORAGE_KEYS.ARTICLES)
  return parseJSON(data, [])
}

// 保存文章列表
export function saveArticles(articles) {
  localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles))
}

// 获取单篇文章
export function getArticleById(id) {
  const articles = getArticles()
  return articles.find(article => article.id === id)
}

// 添加文章
export function addArticle(article) {
  const articles = getArticles()
  const newArticle = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    ...article
  }
  articles.unshift(newArticle)
  saveArticles(articles)
  return newArticle
}

// 更新文章
export function updateArticle(id, updates) {
  const articles = getArticles()
  const index = articles.findIndex(article => article.id === id)
  if (index > -1) {
    articles[index] = { ...articles[index], ...updates }
    saveArticles(articles)
    return articles[index]
  }
  return null
}

// 删除文章
export function deleteArticle(id) {
  const articles = getArticles()
  const index = articles.findIndex(article => article.id === id)
  if (index > -1) {
    articles.splice(index, 1)
    saveArticles(articles)
  }
  return articles
}

// 增加文章浏览量
export function incrementViewCount(id) {
  const articles = getArticles()
  const index = articles.findIndex(article => article.id === id)
  if (index > -1) {
    articles[index].viewCount = (articles[index].viewCount || 0) + 1
    saveArticles(articles)
  }
  return articles[index]
}

// ============ 评论相关函数 ============

// 获取评论列表
export function getComments() {
  const data = localStorage.getItem(STORAGE_KEYS.COMMENTS)
  return parseJSON(data, [])
}

// 保存评论列表
export function saveComments(comments) {
  localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments))
}

// 获取某篇文章的评论
export function getCommentsByArticleId(articleId) {
  const comments = getComments()
  return comments
    .filter(comment => comment.articleId === articleId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

// 添加评论
export function addComment(comment) {
  const comments = getComments()
  const newComment = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    ...comment
  }
  comments.unshift(newComment)
  saveComments(comments)

  // 更新文章评论数
  const articles = getArticles()
  const articleIndex = articles.findIndex(a => a.id === comment.articleId)
  if (articleIndex > -1) {
    articles[articleIndex].commentCount = (articles[articleIndex].commentCount || 0) + 1
    saveArticles(articles)
  }

  return newComment
}

// 删除评论
export function deleteComment(id) {
  const comments = getComments()
  const comment = comments.find(c => c.id === id)
  const index = comments.findIndex(c => c.id === id)

  if (index > -1) {
    comments.splice(index, 1)
    saveComments(comments)

    // 更新文章评论数
    if (comment) {
      const articles = getArticles()
      const articleIndex = articles.findIndex(a => a.id === comment.articleId)
      if (articleIndex > -1) {
        articles[articleIndex].commentCount = Math.max((articles[articleIndex].commentCount || 1) - 1, 0)
        saveArticles(articles)
      }
    }
  }
  return comments
}

// ============ 用户反馈相关函数 ============

// 获取反馈列表
export function getFeedbacks() {
  const data = localStorage.getItem(STORAGE_KEYS.FEEDBACKS)
  return parseJSON(data, [])
}

// 保存反馈列表
export function saveFeedbacks(feedbacks) {
  localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(feedbacks))
}

// 提交反馈
export function submitFeedback(feedback) {
  const feedbacks = getFeedbacks()
  const newFeedback = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    status: 'pending',
    ...feedback
  }
  feedbacks.unshift(newFeedback)
  saveFeedbacks(feedbacks)
  return newFeedback
}

// ============ 初始化默认文章数据 ============

// 初始化默认文章
export function initDefaultArticles() {
  const existingArticles = getArticles()
  if (existingArticles.length === 0) {
    const defaultArticles = [
      {
        id: 'article-1',
        title: 'AI营销时代来临：中小商家如何抓住流量红利',
        summary: '深入分析AI技术如何为中小餐饮、零售商家带来前所未有的营销机遇，以及如何快速上手使用AI工具提升获客效率。',
        content: `<h2>AI营销时代来临：中小商家如何抓住流量红利</h2>
<p>在数字化浪潮席卷各行各业的今天，AI技术已经从概念走向落地，为中小商家带来了前所未有的营销机遇。本文将深入分析AI技术如何为中小餐饮、零售商家带来变革，以及如何快速上手使用AI工具提升获客效率。</p>

<h3>一、AI营销的现状与趋势</h3>
<p>根据最新数据显示，超过60%的中小商家已经开始尝试使用AI工具辅助日常运营。从智能客服到内容生成，从数据分析到精准营销，AI正在以肉眼可见的速度改变着商业运营的模式。</p>
<p>特别是在内容营销领域，AI能够快速生成吸引人的文案，帮助商家在激烈的竞争中脱颖而出。无论是开业促销、会员日活动，还是节日营销，AI都能提供专业、富有创意的文案支持。</p>

<h3>二、中小商家的AI营销机遇</h3>
<p>对于资源有限的中小商家而言，AI营销工具带来了三大核心机遇：</p>
<ol>
<li><strong>成本大幅降低</strong>：无需专业文案团队，AI即可生成专业级营销内容</li>
<li><strong>效率显著提升</strong>：从数小时缩短到数秒，快速响应市场变化</li>
<li><strong>效果可量化</strong>：通过数据分析持续优化营销策略</li>
</ol>

<h3>三、如何开始使用AI营销工具</h3>
<p>作为中小商家，可以从以下几个方面快速上手：</p>
<ul>
<li>选择适合自己行业的AI营销工具</li>
<li>学习基础的内容生成技巧</li>
<li>建立数据反馈机制，持续优化</li>
<li>结合自身特色，打造差异化内容</li>
</ul>

<h3>四、结语</h3>
<p>AI营销不是大企业的专利，而是每个商家都能享受的技术红利。关键在于主动学习和积极尝试。让我们一起拥抱AI，共创美好未来！</p>`,
        category: '行业分析',
        author: 'AI营销专家',
        cover: 'https://picsum.photos/seed/article1/800/400',
        tags: ['AI营销', '流量红利', '中小商家'],
        viewCount: 1256,
        likeCount: 89,
        commentCount: 23,
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'article-2',
        title: '餐饮行业营销案例：如何用AI文案提升门店客流',
        summary: '分享三个真实的餐饮行业AI营销案例，展示如何通过智能文案实现营业额提升30%的实战经验。',
        content: `<h2>餐饮行业营销案例：如何用AI文案提升门店客流</h2>
<p>在竞争激烈的餐饮行业，如何让顾客选择你的门店？本文将分享三个真实的AI营销案例，展示如何通过智能文案实现营业额显著提升。</p>

<h3>案例一：社区火锅店的会员日营销</h3>
<p>张老板经营一家社区火锅店，长期为如何提升会员日的客流量发愁。在使用AI营销工具后，他生成了这样的文案：</p>
<blockquote>【限时福利】会员日专属！全场菜品8折，再送招牌羊肉一份！本周三，与好友共享火锅盛宴，温暖这个冬天~</blockquote>
<p>结果：该文案帮助门店会员日客流提升了45%，单日营业额突破历史新高。</p>

<h3>案例二：咖啡店的社交媒体推广</h3>
<p>一家精品咖啡店需要定期更新社交媒体内容，但苦于没有专人负责。通过AI工具，他们生成了系列创意文案：</p>
<blockquote>☕ 清晨的第一缕阳光，遇见一杯醇香咖啡<br>今日推荐：燕麦拿铁，植物基更健康<br>限时优惠：买二送一，和闺蜜一起享受悠闲午后</blockquote>
<p>结果：月度社交媒体互动量增长200%，新客到店率提升35%。</p>

<h3>案例三：快餐店的外卖平台优化</h3>
<p>快餐店老板李女士发现店铺在外卖平台的转化率不高。AI工具帮她优化了产品描述：</p>
<blockquote>【招牌炸鸡】外酥里嫩，独家秘制酱料，每一口都是满足！月售1000+，好评如潮~</blockquote>
<p>结果：单品点击率提升60%，复购率增加28%。</p>

<h3>成功经验总结</h3>
<p>从以上案例可以看出，AI营销文案的关键在于：</p>
<ul>
<li>突出产品特色和差异化优势</li>
<li>使用引发食欲的描述词汇</li>
<li>加入限时优惠等紧迫感元素</li>
<li>适当使用emoji增加视觉吸引力</li>
</ul>`,
        category: '案例研究',
        author: '餐饮运营顾问',
        cover: 'https://picsum.photos/seed/article2/800/400',
        tags: ['餐饮营销', '案例分享', '实战技巧'],
        viewCount: 892,
        likeCount: 56,
        commentCount: 15,
        createdAt: '2024-01-10T08:30:00Z'
      },
      {
        id: 'article-3',
        title: '2024年营销趋势预测：这5个方向值得关注',
        summary: '预测2024年AI营销领域的重要发展趋势，帮助商家提前布局，抢占先机。',
        content: `<h2>2024年营销趋势预测：这5个方向值得关注</h2>
<p>新的一年，营销领域将发生哪些变化？本文将为您分析2024年最重要的营销趋势，帮助商家提前布局。</p>

<h3>趋势一：AI内容生产常态化</h3>
<p>AI生成内容将不再是新鲜事，而是成为营销的标配。从文案到图片，从视频到音频，AI将渗透到内容创作的每个环节。</p>

<h3>趋势二：私域流量价值凸显</h3>
<p>随着公域流量成本上升，更多商家将重心转向私域运营。微信群、小程序、会员系统将成为商家必争之地。</p>

<h3>趋势三：短视频营销持续火热</h3>
<p>短视频平台的用户时长仍在增长，商家需要更加重视短视频内容的创作和投放。</p>

<h3>趋势四：本地化营销精准化</h3>
<p>基于位置的精准营销将更加普及，LBS技术将帮助商家触达周边潜在客户。</p>

<h3>趋势五：数据驱动决策普及</h3>
<p>越来越多的商家将意识到数据的重要性，开始建立完善的数据采集和分析体系。</p>

<h3>商家应对策略</h3>
<p>面对这些趋势，建议商家：</p>
<ol>
<li>尽快熟悉AI工具的使用</li>
<li>建立自己的内容生产流程</li>
<li>重视客户数据的收集和分析</li>
<li>培养新媒体运营能力</li>
</ol>`,
        category: '趋势预测',
        author: '数字营销分析师',
        cover: 'https://picsum.photos/seed/article3/800/400',
        tags: ['2024趋势', '营销预测', '行业洞察'],
        viewCount: 1543,
        likeCount: 102,
        commentCount: 31,
        createdAt: '2024-01-05T14:20:00Z'
      },
      {
        id: 'article-4',
        title: '新手入门：5分钟学会AI营销文案生成',
        summary: '为零基础商家打造的AI工具使用教程，手把手教你生成高质量营销文案。',
        content: `<h2>新手入门：5分钟学会AI营销文案生成</h2>
<p>很多商家对AI工具望而却步，担心操作复杂、学习成本高。其实，AI营销文案生成非常简单，只需几分钟就能上手。本文将手把手教你如何快速生成高质量营销文案。</p>

<h3>第一步：选择合适的工具</h3>
<p>首先，你需要选择一个适合自己的AI营销工具。好的工具应该具备以下特点：</p>
<ul>
<li>操作简单，界面友好</li>
<li>支持多种内容类型</li>
<li>提供丰富的模板</li>
<li>支持自定义编辑</li>
</ul>

<h3>第二步：选择内容类型</h3>
<p>根据你的营销需求，选择相应的内容类型：</p>
<ol>
<li>营销文案：适用于促销活动、新品推广</li>
<li>产品描述：适用于电商平台、菜单展示</li>
<li>社交媒体：适用于微信、微博、抖音等平台</li>
</ol>

<h3>第三步：输入关键信息</h3>
<p>AI需要了解你的店铺信息才能生成精准文案。你需要提供：</p>
<ul>
<li>店铺/品牌名称</li>
<li>主要产品或服务</li>
<li>目标客户群体</li>
<li>活动主题或亮点</li>
</ul>

<h3>第四步：生成与编辑</h3>
<p>点击生成按钮，AI会瞬间产出多条文案建议。你可以：</p>
<ul>
<li>选择最满意的一条</li>
<li>对文案进行微调</li>
<li>复制保存或直接使用</li>
</ul>

<h3>第五步：持续优化</h3>
<p>好的文案需要不断优化。建议：</p>
<ul>
<li>记录效果好的文案特点</li>
<li>分析用户反馈和数据</li>
<li>尝试不同的风格和角度</li>
</ul>

<h3>常见问题解答</h3>
<p><strong>Q：AI生成的文案会不会千篇一律？</strong><br>
A：不会。AI会根据你提供的信息和选择的风格生成多样化内容。</p>

<p><strong>Q：生成的文案可以直接使用吗？</strong><br>
A：建议根据实际情况进行适当修改，使文案更符合你的品牌调性。</p>`,
        category: '使用教程',
        author: '产品经理',
        cover: 'https://picsum.photos/seed/article4/800/400',
        tags: ['新手教程', 'AI工具', '快速上手'],
        viewCount: 2341,
        likeCount: 156,
        commentCount: 42,
        createdAt: '2024-01-01T09:00:00Z'
      },
      {
        id: 'article-5',
        title: '提升复购率：会员营销的黄金法则',
        summary: '探讨如何通过精细化会员运营提升客户复购率，包含实用的策略和案例分析。',
        content: `<h2>提升复购率：会员营销的黄金法则</h2>
<p>获取新客户的成本是维护老客户的5-7倍，因此提升复购率对于商家至关重要。本文将分享会员营销的核心策略。</p>

<h3>为什么要重视会员复购？</h3>
<ul>
<li>降低营销成本：维护老客户比获取新客更经济</li>
<li>提升客单价：忠诚会员消费频次和金额更高</li>
<li>口碑传播：满意会员会主动推荐新客户</li>
<li>数据价值：会员数据帮助精准营销</li>
</ul>

<h3>会员营销五大黄金法则</h3>

<h4>1. 差异化权益设计</h4>
<p>不同等级会员享受不同权益，激发升级动力。</p>

<h4>2. 积分体系优化</h4>
<p>积分获取和使用规则要简单明了，让会员感受到价值。</p>

<h4>3. 精准触达</h4>
<p>基于消费习惯，进行个性化推荐和优惠推送。</p>

<h4>4. 活动策划</h4>
<p>定期举办会员专属活动，增强归属感。</p>

<h4>5. 服务体验</h4>
<p>优质的服务是留住会员的根本。</p>

<h3>成功案例</h3>
<p>某社区生鲜店通过会员营销系统，实现了：</p>
<ul>
<li>会员复购率从35%提升至68%</li>
<li>会员月均消费额增长45%</li>
<li>老客户转介绍率提升3倍</li>
</ul>`,
        category: '运营技巧',
        author: '会员运营专家',
        cover: 'https://picsum.photos/seed/article5/800/400',
        tags: ['会员营销', '复购率', '精细化运营'],
        viewCount: 756,
        likeCount: 48,
        commentCount: 12,
        createdAt: '2023-12-28T11:15:00Z'
      },
      {
        id: 'article-6',
        title: '社交媒体内容规划：让发布更有节奏',
        summary: '分享社交媒体内容排期和策划的技巧，帮助商家建立稳定的内容输出节奏。',
        content: `<h2>社交媒体内容规划：让发布更有节奏</h2>
<p>很多商家做社交媒体时，要么三天打鱼两天晒网，要么手忙脚乱不知从何下手。建立一个科学的内容规划体系，能让运营事半功倍。</p>

<h3>为什么要做内容规划？</h3>
<ul>
<li>保证更新频率，维持账号活跃度</li>
<li>提前准备内容，提高质量</li>
<li>合理分配精力，避免临时抱佛脚</li>
<li>数据积累，便于分析优化</li>
</ul>

<h3>内容规划四步法</h3>

<h4>第一步：确定内容支柱</h4>
<p>围绕3-5个核心主题持续输出，如：产品介绍、用户评价、使用技巧、优惠信息品牌故事</p>

<h4>第二步：制定发布节奏</h4>
<p>建议频率：</p>
<ul>
<li>微信：每天1-2条</li>
<li>微博：每天3-5条</li>
<li>抖音：每周2-3条</li>
<li>小红书：每周3-5条</li>
</ul>

<h4>第三步：建立内容日历</h4>
<p>提前规划每月、每周、每天的发布内容，标记重要节点和活动。</p>

<h4>第四步：执行与复盘</h4>
<p>按照计划执行，定期分析数据，优化内容策略。</p>`,
        category: '运营技巧',
        author: '新媒体运营经理',
        cover: 'https://picsum.photos/seed/article6/800/400',
        tags: ['社交媒体', '内容规划', '运营节奏'],
        viewCount: 623,
        likeCount: 39,
        commentCount: 8,
        createdAt: '2023-12-25T16:30:00Z'
      }
    ]
    saveArticles(defaultArticles)
  }
}

// 组合式 API hook
export function useStorage() {
  const history = ref(getHistory())
  const favorites = ref(getFavorites())

  // 监听变化并同步
  watch(history, (newVal) => {
    saveHistory(newVal)
  }, { deep: true })

  watch(favorites, (newVal) => {
    saveFavorites(newVal)
  }, { deep: true })

  return {
    history,
    favorites,
    addHistory,
    deleteHistory,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearHistory,
    getHistory,
    getFavorites
  }
}

// ============ 视频教程相关函数 ============

// 获取视频列表
export function getVideos() {
  const data = localStorage.getItem(STORAGE_KEYS.VIDEOS)
  return parseJSON(data, [])
}

// 保存视频列表
export function saveVideos(videos) {
  localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(videos))
}

// 获取单个视频
export function getVideoById(id) {
  const videos = getVideos()
  return videos.find(video => video.id === id)
}

// 添加视频
export function addVideo(video) {
  const videos = getVideos()
  const newVideo = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    views: 0,
    ...video
  }
  videos.unshift(newVideo)
  saveVideos(videos)
  return newVideo
}

// 增加视频浏览量
export function incrementVideoViewCount(id) {
  const videos = getVideos()
  const index = videos.findIndex(video => video.id === id)
  if (index > -1) {
    videos[index].views = (videos[index].views || 0) + 1
    saveVideos(videos)
    return videos[index]
  }
  return null
}

// ============ 讨论区话题相关函数 ============

// 获取话题列表
export function getTopics() {
  const data = localStorage.getItem(STORAGE_KEYS.TOPICS)
  return parseJSON(data, [])
}

// 保存话题列表
export function saveTopics(topics) {
  localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(topics))
}

// 获取单个话题
export function getTopicById(id) {
  const topics = getTopics()
  return topics.find(topic => topic.id === id)
}

// 添加话题
export function addTopic(topic) {
  const topics = getTopics()
  const newTopic = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    voteCount: 0,
    isVoted: false,
    commentCount: 0,
    viewCount: 0,
    ...topic
  }
  topics.unshift(newTopic)
  saveTopics(topics)
  return newTopic
}

// 点赞话题
export function voteTopic(id) {
  const topics = getTopics()
  const index = topics.findIndex(topic => topic.id === id)
  if (index > -1) {
    if (topics[index].isVoted) {
      // 取消点赞
      topics[index].voteCount = Math.max((topics[index].voteCount || 1) - 1, 0)
      topics[index].isVoted = false
    } else {
      // 点赞
      topics[index].voteCount = (topics[index].voteCount || 0) + 1
      topics[index].isVoted = true
    }
    saveTopics(topics)
  }
  return topics
}

// 增加话题浏览量
export function incrementTopicViewCount(id) {
  const topics = getTopics()
  const index = topics.findIndex(topic => topic.id === id)
  if (index > -1) {
    topics[index].viewCount = (topics[index].viewCount || 0) + 1
    saveTopics(topics)
    return topics[index]
  }
  return null
}

// ============ 初始化默认视频数据 ============

// 初始化默认视频
export function initDefaultVideos() {
  const existingVideos = getVideos()
  if (existingVideos.length === 0) {
    const defaultVideos = [
      {
        id: 'video-1',
        title: '新手入门：5分钟快速上手AI营销',
        description: '本教程将带领新手商家快速了解AI营销工具的基本使用方法，包括如何选择内容类型、输入店铺信息、生成营销文案等基础操作。',
        cover: 'https://picsum.photos/seed/video1/800/450',
        duration: '05:32',
        category: '入门教程',
        views: 3256,
        createdAt: '2024-01-20T10:00:00Z'
      },
      {
        id: 'video-2',
        title: '营销文案生成技巧深度解析',
        description: '深入讲解如何通过优化输入信息获得更高质量的营销文案，包括关键词选择、场景描述、目标受众分析等技巧。',
        cover: 'https://picsum.photos/seed/video2/800/450',
        duration: '12:45',
        category: '高级技巧',
        views: 1843,
        createdAt: '2024-01-18T14:30:00Z'
      },
      {
        id: 'video-3',
        title: '餐饮行业案例实战：火锅店营销',
        description: '通过一个真实的火锅店营销案例，展示如何从零开始创建一套完整的营销方案，包括会员日活动、社交媒体推广等。',
        cover: 'https://picsum.photos/seed/video3/800/450',
        duration: '18:20',
        category: '案例实战',
        views: 2156,
        createdAt: '2024-01-15T09:15:00Z'
      },
      {
        id: 'video-4',
        title: '社交媒体内容创作全攻略',
        description: '全面讲解如何在微信、微博、抖音等平台创作吸引人的营销内容，包括内容策划、视觉设计、发布时间等策略。',
        cover: 'https://picsum.photos/seed/video4/800/450',
        duration: '22:10',
        category: '高级技巧',
        views: 1567,
        createdAt: '2024-01-12T16:45:00Z'
      },
      {
        id: 'video-5',
        title: '零售店铺产品描述优化',
        description: '手把手教你如何为电商平台和线下店铺写出让顾客心动的产品描述，提升转化率和客单价。',
        cover: 'https://picsum.photos/seed/video5/800/450',
        duration: '15:30',
        category: '案例实战',
        views: 1234,
        createdAt: '2024-01-10T11:20:00Z'
      },
      {
        id: 'video-6',
        title: 'AI工具高级设置与自定义',
        description: '介绍AI营销工具的高级功能，包括自定义模板、偏好设置、批量生成等高级操作技巧。',
        cover: 'https://picsum.photos/seed/video6/800/450',
        duration: '20:15',
        category: '高级技巧',
        views: 987,
        createdAt: '2024-01-08T13:00:00Z'
      }
    ]
    saveVideos(defaultVideos)
  }
}

// ============ 初始化默认话题数据 ============

// 初始化默认话题
export function initDefaultTopics() {
  const existingTopics = getTopics()
  if (existingTopics.length === 0) {
    const defaultTopics = [
      {
        id: 'topic-1',
        title: '分享我的第一个AI营销文案 - 火锅店会员日',
        content: '今天第一次使用AI营销工具，为我们店的会员日活动生成文案，效果出乎意料的好！生成的文案既专业又吸引人，会员日的客流比平时多了将近一倍。强烈推荐给各位餐饮同行！',
        category: '经验分享',
        author: '火锅店小张',
        voteCount: 45,
        isVoted: false,
        commentCount: 12,
        viewCount: 328,
        createdAt: '2024-01-20T15:30:00Z'
      },
      {
        id: 'topic-2',
        title: '求助：如何让AI生成的文案更有个人特色？',
        content: '最近刚开始用AI营销工具，生成的文案质量很好，但感觉缺少一些个人风格。有没有前辈可以分享一些技巧，让文案在专业的同时也能体现我们店铺的独特调性？',
        category: '问题求助',
        author: '咖啡店主小李',
        voteCount: 28,
        isVoted: false,
        commentCount: 8,
        viewCount: 156,
        createdAt: '2024-01-19T10:20:00Z'
      },
      {
        id: 'topic-3',
        title: '互换资源：餐饮行业营销资料包',
        content: '我整理了一套餐饮行业营销资料包，包含各类型餐饮的营销方案、节日活动策划、会员运营技巧等。有需要的朋友可以留言互换或免费分享给大家，一起进步！',
        category: '资源互换',
        author: '运营达人',
        voteCount: 67,
        isVoted: false,
        commentCount: 23,
        viewCount: 456,
        createdAt: '2024-01-18T14:45:00Z'
      },
      {
        id: 'topic-4',
        title: '关于AI生成文案的版权问题讨论',
        content: '想和大家讨论一下，使用AI生成的营销文案是否需要特别注意版权问题？有没有了解相关法规的朋友可以科普一下？',
        category: '经验分享',
        author: '法律爱好者',
        voteCount: 34,
        isVoted: false,
        commentCount: 15,
        viewCount: 289,
        createdAt: '2024-01-17T09:10:00Z'
      },
      {
        id: 'topic-5',
        title: '新手求助：社交媒体内容怎么规划？',
        content: '刚开店不久，想做好社交媒体营销，但每天发什么内容很头疼没有高手可以。有分享一套简单实用的内容规划方法？不需要太复杂， 能坚持执行就行。',
        category: '问题求助',
        author: '新手小白',
        voteCount: 19,
        isVoted: false,
        commentCount: 6,
        viewCount: 98,
        createdAt: '2024-01-16T16:30:00Z'
      },
      {
        id: 'topic-6',
        title: '推荐一个超好用的配图素材网站',
        content: '发现一个免费商用的图片素材网站，AI生成的文案配合高质量配图，效果翻倍！分享给需要的朋友们。',
        category: '资源互换',
        author: '设计小王',
        voteCount: 52,
        isVoted: false,
        commentCount: 18,
        viewCount: 412,
        createdAt: '2024-01-15T11:20:00Z'
      }
    ]
    saveTopics(defaultTopics)
  }
}
