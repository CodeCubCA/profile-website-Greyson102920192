import streamlit as st
import os
from groq import Groq
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# Page configuration
st.set_page_config(
    page_title="Study Buddy - AI Learning Assistant",
    page_icon="📚",
    layout="centered"
)

# Title and description
st.title("📚 Study Buddy")
st.markdown("Your AI learning companion, ready to help you with your study questions!")

# Initialize Groq client
@st.cache_resource
def init_groq_client():
    """Initialize Groq API client"""
    # Prioritize Streamlit Secrets (for Streamlit Cloud)
    # Fall back to environment variables (for local development)
    api_key = None

    # Try to get from Streamlit secrets
    try:
        api_key = st.secrets["GROQ_API_KEY"]
    except (KeyError, FileNotFoundError):
        # If secrets don't exist, try environment variables
        api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        st.error("❌ Please set GROQ_API_KEY")
        st.info("💡 Local development: Set in .env file\n\n💡 Streamlit Cloud: Set in Settings → Secrets")
        st.stop()

    return Groq(api_key=api_key)

client = init_groq_client()

# Initialize session state for storing chat history
if "messages" not in st.session_state:
    st.session_state.messages = []
    # Add system prompt to define AI assistant's role
    st.session_state.messages.append({
        "role": "system",
        "content": "You are Study Buddy, a friendly and professional learning assistant. Your task is to help students understand various subjects, answer questions, and provide study advice. Explain concepts in a clear and understandable way, and give examples when appropriate. Maintain a patient and encouraging attitude."
    })

# Display chat history (excluding system messages)
for message in st.session_state.messages:
    if message["role"] != "system":
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

# Chat input box
if prompt := st.chat_input("What study questions do you have for me?"):
    # Add user message to chat history
    st.session_state.messages.append({"role": "user", "content": prompt})

    # Display user message
    with st.chat_message("user"):
        st.markdown(prompt)

    # Display AI response
    with st.chat_message("assistant"):
        message_placeholder = st.empty()
        full_response = ""

        try:
            # Call Groq API for streaming response
            stream = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=st.session_state.messages,
                temperature=0.7,  # Control creativity of response, between 0-1
                max_tokens=2048,  # Maximum response length
                stream=True  # Enable streaming output
            )

            # Display AI response word by word
            for chunk in stream:
                if chunk.choices[0].delta.content:
                    full_response += chunk.choices[0].delta.content
                    message_placeholder.markdown(full_response + "▌")

            # Display complete response
            message_placeholder.markdown(full_response)

            # Save assistant response to chat history
            st.session_state.messages.append({"role": "assistant", "content": full_response})

        except Exception as e:
            st.error(f"❌ An error occurred: {str(e)}")
            st.info("💡 Please check that your API key is correct and your network connection is stable.")

# Sidebar - Features
with st.sidebar:
    st.header("⚙️ Settings")

    # Clear chat history button
    if st.button("🗑️ Clear Chat History", use_container_width=True):
        st.session_state.messages = []
        # Re-add system prompt
        st.session_state.messages.append({
            "role": "system",
            "content": "You are Study Buddy, a friendly and professional learning assistant. Your task is to help students understand various subjects, answer questions, and provide study advice. Explain concepts in a clear and understandable way, and give examples when appropriate. Maintain a patient and encouraging attitude."
        })
        st.rerun()

    st.markdown("---")

    # User guide
    st.header("📖 User Guide")
    st.markdown("""
    **Study Buddy can help you with:**
    - 📝 Explaining subject concepts
    - 🧮 Solving math problems
    - 💬 Practicing language learning
    - 🔬 Understanding scientific principles
    - 📚 Providing study advice

    **Tips for best results:**
    - Ask specific and clear questions
    - Request examples for better understanding
    - Ask for simpler explanations if needed
    """)

    st.markdown("---")
    st.caption("Powered by Groq API (Llama 3.3 70B)")
