import json
import re

# 读取 resources.json
with open(r'd:\project\steinsgate.github.io\data\resources.json', 'r', encoding='utf-8') as f:
    resources = json.load(f)

# 根据URL生成描述的函数
def generate_desc_from_url(url):
    # 移除协议和www
    domain = re.sub(r'^https?://(www\.)?', '', url)
    domain = domain.split('/')[0]
    
    # 常见网站的描述模板
    desc_templates = {
        'github.com': 'GitHub 代码托管平台',
        'bilibili.com': 'B站 视频分享平台',
        'youtube.com': 'YouTube 视频平台',
        'douban.com': '豆瓣 社区网站',
        'zhihu.com': '知乎 问答社区',
        'juejin.cn': '掘金 技术社区',
        'csdn.net': 'CSDN 技术社区',
        'cnblogs.com': '博客园 技术社区',
        'segmentfault.com': 'SegmentFault 技术问答',
        'stackoverflow.com': 'Stack Overflow 开发者社区',
        'v2ex.com': 'V2EX 技术社区',
        'aliyun.com': '阿里云 云服务',
        'tencent.com': '腾讯 云服务',
        'baidu.com': '百度 搜索服务',
        'google.com': 'Google 搜索服务',
        'taobao.com': '淘宝 电商平台',
        'jd.com': '京东 电商平台',
        'amazon.com': 'Amazon 电商平台',
        'medium.com': 'Medium 文章平台',
        'notion.so': 'Notion 笔记工具',
        'figma.com': 'Figma 设计工具',
        'canva.com': 'Canva 在线设计',
        'chat.openai.com': 'ChatGPT AI对话',
        'copilot.github.com': 'GitHub Copilot AI编程',
    }
    
    for key, desc in desc_templates.items():
        if key in domain:
            return desc
    
    # 如果没有匹配，返回域名作为简单描述
    return f'{domain} 网站'

# 检查并添加缺失的desc
missing_desc_count = 0
total_items = 0

for category in resources:
    for item in category['items']:
        total_items += 1
        # 如果没有desc，生成一个
        if not item.get('desc') or item['desc'].strip() == '':
            item['desc'] = generate_desc_from_url(item['url'])
            missing_desc_count += 1

# 保存更新后的文件
with open(r'd:\project\steinsgate.github.io\data\resources.json', 'w', encoding='utf-8') as f:
    json.dump(resources, f, ensure_ascii=False, indent=2)

print(f'处理完成！')
print(f'总资源数量: {total_items}')
print(f'添加了 {missing_desc_count} 个缺失的描述')
print(f'剩余缺失描述: {missing_desc_count}')