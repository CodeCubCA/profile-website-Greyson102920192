import streamlit as st
import os
from groq import Groq
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 页面配置
st.set_page_config(
    page_title="Study Buddy - AI学习助手",
    page_icon="📚",
    layout="centered"
)

# 标题和描述
st.title("📚 Study Buddy")
st.markdown("你的AI学习伙伴，随时帮助你解答学习问题！")

# 初始化 Groq 客户端
@st.cache_resource
def init_groq_client():
    """初始化Groq API客户端"""
    # 优先使用 Streamlit Secrets (用于 Streamlit Cloud)
    # 如果不存在则使用环境变量 (用于本地开发)
    api_key = None

    # 尝试从 Streamlit secrets 获取
    try:
        api_key = st.secrets["GROQ_API_KEY"]
    except (KeyError, FileNotFoundError):
        # 如果 secrets 不存在，尝试从环境变量获取
        api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        st.error("❌ 请设置 GROQ_API_KEY")
        st.info("💡 本地开发：在 .env 文件中设置\n\n💡 Streamlit Cloud：在 Settings → Secrets 中设置")
        st.stop()

    return Groq(api_key=api_key)

client = init_groq_client()

# 初始化会话状态，用于存储聊天历史
if "messages" not in st.session_state:
    st.session_state.messages = []
    # 添加系统提示词，定义AI助手的角色
    st.session_state.messages.append({
        "role": "system",
        "content": "你是一个友好且专业的学习助手 Study Buddy。你的任务是帮助学生理解各种学科知识，解答问题，提供学习建议。请用清晰、易懂的方式解释概念，并在适当时候给出例子。保持耐心和鼓励的态度。"
    })

# 显示聊天历史（不显示系统消息）
for message in st.session_state.messages:
    if message["role"] != "system":
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

# 聊天输入框
if prompt := st.chat_input("有什么学习问题想问我吗？"):
    # 添加用户消息到聊天历史
    st.session_state.messages.append({"role": "user", "content": prompt})

    # 显示用户消息
    with st.chat_message("user"):
        st.markdown(prompt)

    # 显示AI回复
    with st.chat_message("assistant"):
        message_placeholder = st.empty()
        full_response = ""

        try:
            # 调用 Groq API 进行流式响应
            stream = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=st.session_state.messages,
                temperature=0.7,  # 控制回复的创造性，0-1之间
                max_tokens=2048,  # 最大回复长度
                stream=True  # 启用流式输出
            )

            # 逐字显示AI回复
            for chunk in stream:
                if chunk.choices[0].delta.content:
                    full_response += chunk.choices[0].delta.content
                    message_placeholder.markdown(full_response + "▌")

            # 显示完整回复
            message_placeholder.markdown(full_response)

            # 保存助手回复到聊天历史
            st.session_state.messages.append({"role": "assistant", "content": full_response})

        except Exception as e:
            st.error(f"❌ 发生错误：{str(e)}")
            st.info("💡 请检查你的 API 密钥是否正确，以及网络连接是否正常。")

# 侧边栏 - 功能区
with st.sidebar:
    st.header("⚙️ 设置")

    # 清除聊天历史按钮
    if st.button("🗑️ 清除聊天记录", use_container_width=True):
        st.session_state.messages = []
        # 重新添加系统提示词
        st.session_state.messages.append({
            "role": "system",
            "content": "你是一个友好且专业的学习助手 Study Buddy。你的任务是帮助学生理解各种学科知识，解答问题，提供学习建议。请用清晰、易懂的方式解释概念，并在适当时候给出例子。保持耐心和鼓励的态度。"
        })
        st.rerun()

    st.markdown("---")

    # 使用说明
    st.header("📖 使用指南")
    st.markdown("""
    **Study Buddy 可以帮你：**
    - 📝 解释学科概念
    - 🧮 解答数学问题
    - 💬 练习语言学习
    - 🔬 理解科学原理
    - 📚 提供学习建议

    **使用技巧：**
    - 提问要具体明确
    - 可以要求举例说明
    - 如果不理解可以要求更简单的解释
    """)

    st.markdown("---")
    st.caption("Powered by Groq API (Llama 3.3 70B)")
