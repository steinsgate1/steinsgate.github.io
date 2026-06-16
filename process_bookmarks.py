import json
import sys

# 设置输出编码
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# 读取 bookmarks.json
with open(r'd:\project\steinsgate.github.io\data\bookmarks.json', 'r', encoding='utf-8') as f:
    bookmarks = json.load(f)

# 读取 resources.json
with open(r'd:\project\steinsgate.github.io\data\resources.json', 'r', encoding='utf-8') as f:
    resources = json.load(f)

# 收集 bookmarks 中所有唯一的 URL（按分类分组）
bookmark_categories = {}
for category in bookmarks:
    cat_name = category['name']
    if cat_name not in bookmark_categories:
        bookmark_categories[cat_name] = {}
    
    for item in category['items']:
        url = item['url']
        if url not in bookmark_categories[cat_name]:
            bookmark_categories[cat_name][url] = item

# 获取 resources 中已存在的所有 URL
existing_urls = set()
for cat in resources:
    for item in cat['items']:
        url = item['url']
        existing_urls.add(url)

# 分类映射表
category_mapping = {
    'AI': 'AI工具',
    '绘画': '摄影设计',
    '资源': '实用工具',
    '惠州学院': '校园服务',
    'u': '实用工具',
    '作业': '学习资源',
    '毕设': '学习资源',
    '小程序': '开发工具',
    '音乐': '音效视频',
    'tool': '实用工具',
    '考研': '学习资源',
    '图片': '摄影设计',
    '机场': '实用工具',
    '下载': '下载工具',
    '影视': '影视资源',
    '电子书': '电子书',
    '学习': '学习资源',
    '游戏': '游戏资源',
    'VR': 'VR资源',
    '动漫': '影视资源',
    '工作': '开发工具',
    '网页': '开发工具',
    '美团收银系统': '实用工具',
    '英语': '学习资源',
    '求职': '实用工具',
    '高并发': '开发工具',
    '成长': '学习资源',
    'guitar': '实用工具',
    'articles': '学习资源',
    'English': '学习资源',
    '新闻': '学习资源',
    '日本語': '学习资源',
    '日语生肉': '学习资源',
    '吉他': '实用工具',
    'comic': '影视资源',
    'video': '音效视频',
    'galgame': '游戏资源'
}

# 图标映射表
icon_mapping = {
    'AI': '🤖',
    '绘画': '🎨',
    '资源': '📦',
    '惠州学院': '🏫',
    'u': '🔧',
    '作业': '📝',
    '毕设': '📝',
    '小程序': '📱',
    '音乐': '🎵',
    'tool': '🔧',
    '考研': '📚',
    '图片': '🖼️',
    '机场': '✈️',
    '下载': '⬇️',
    '影视': '🎬',
    '电子书': '📖',
    '学习': '📚',
    '游戏': '🎮',
    'VR': '🥽',
    '动漫': '🎬',
    '工作': '💼',
    '网页': '🌐',
    '美团收银系统': '💰',
    '英语': '🔤',
    '求职': '💼',
    '高并发': '⚡',
    '成长': '🌱',
    'guitar': '🎸',
    'articles': '📄',
    'English': '🔤',
    '新闻': '📰',
    '日本語': '🇯🇵',
    '日语生肉': '🇯🇵',
    '吉他': '🎸',
    'comic': '📚',
    'video': '🎬',
    'galgame': '🎮'
}

# 处理每个书签分类
added_count = 0
new_categories = []

for cat_name, items in bookmark_categories.items():
    # 确定目标分类名
    target_cat_name = category_mapping.get(cat_name, cat_name)
    
    # 查找目标分类是否存在
    target_cat = None
    for cat in resources:
        if cat['category'] == target_cat_name:
            target_cat = cat
            break
    
    # 如果分类不存在，创建新分类
    if target_cat is None:
        target_cat = {
            'category': target_cat_name,
            'icon': icon_mapping.get(cat_name, '📁'),
            'items': []
        }
        new_categories.append(target_cat)
    
    # 添加不存在的 URL
    for url, item in items.items():
        if url not in existing_urls:
            new_item = {
                'title': item['title'],
                'url': url,
                'desc': ''
            }
            target_cat['items'].append(new_item)
            existing_urls.add(url)
            added_count += 1

# 将新分类添加到 resources
resources.extend(new_categories)

# 保存更新后的 resources.json
with open(r'd:\project\steinsgate.github.io\data\resources.json', 'w', encoding='utf-8') as f:
    json.dump(resources, f, ensure_ascii=False, indent=2)

# 清理 bookmarks.json，只保留去重后的数据
clean_bookmarks = []
for cat_name, items in bookmark_categories.items():
    clean_bookmarks.append({
        'name': cat_name,
        'icon': icon_mapping.get(cat_name, '📁'),
        'items': list(items.values())
    })

with open(r'd:\project\steinsgate.github.io\data\bookmarks.json', 'w', encoding='utf-8') as f:
    json.dump(clean_bookmarks, f, ensure_ascii=False, indent=2)

print(f'处理完成！')
print(f'新增 URL 数量: {added_count}')
print(f'新增分类数量: {len(new_categories)}')
print(f'处理的书签分类数量: {len(bookmark_categories)}')