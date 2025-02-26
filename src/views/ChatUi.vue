<template>
    <div class="app-container">
    <div class="chat-container">
      <!-- Header -->
      <div class="header">
        <h2>Music Discovery Assistant</h2>
      </div>

      <!-- Chat History -->
      <div class="chat-history">
        <div
          v-for="(message, index) in conversation"
          :key="message.timestamp"
          :class="['message', message.type === 'user' ? 'user-message' : 'assistant-message']"
        >
          <p>{{ message.content }}</p>
          <div v-if="message.type === 'assistant'" class="feedback-buttons">
            <button
              class="feedback-btn"
              :class="{ 'active': feedback[index] === true }"
              @click="handleFeedback(index, true)"
            >
            </button>
            <button
              class="feedback-btn"
              :class="{ 'active': feedback[index] === false }"
              @click="handleFeedback(index, false)"
            >
            </button>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="input-area">
        <input
          v-model="message"
          type="text"
          placeholder="Tell me about your music preferences..."
          @keyup.enter="handleSendMessage(message, $event)"
        />
        <button class="send-btn" @click="handleSendMessage(message,$event)">
          send
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Message } from '../models/ConvesationMessage';

export default{
    data() {
      return {
        message: "",
        conversation:[]
      }
    },
    methods:{
      handleSendMessage(message){
        console.log(message);
        const msg = new Message("user", message)
        this.conversation.push(msg);
      }
    }
}
</script>

<style>
.app-container {
  min-height: 100vh;
  background: #1a1a1a;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.chat-container {
  width: 100%;
  max-width: 600px;
  background: #2d2d2d;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #363636;
  color: #ffffff;
}

.icon {
  width: 24px;
  height: 24px;
  color: #7c3aed;
}

.icon-small {
  width: 16px;
  height: 16px;
}

.chat-history {
  height: 400px;
  overflow-y: auto;
  padding: 16px;
}

.message {
  margin: 8px 0;
  padding: 12px;
  border-radius: 8px;
  color: #ffffff;
}

.user-message {
  background: #4a5568;
  margin-left: 32px;
}

.assistant-message {
  background: #3a3a3a;
  margin-right: 32px;
}

.feedback-buttons {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.feedback-btn {
  background: transparent;
  border: none;
  padding: 4px;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.feedback-btn:hover {
  background: #4a4a4a;
}

.feedback-btn.active {
  color: #7c3aed;
}

.input-area {
  display: flex;
  gap: 8px;
  padding: 16px;
  background: #363636;
}

input {
  flex: 1;
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #4a4a4a;
  background: #2d2d2d;
  color: #ffffff;
  outline: none;
}

input::placeholder {
  color: #9ca3af;
}

.send-btn {
  background: #7c3aed;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.send-btn:hover {
  background: #6d28d9;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #2d2d2d;
}

::-webkit-scrollbar-thumb {
  background: #4a4a4a;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #5a5a5a;
}
</style>