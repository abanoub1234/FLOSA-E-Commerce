import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  apiUrl: string = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  apiKey: string = 'AIzaSyCEpvgSuxgLudVdJN903YiYus7Oir7zB-g'; // ❗ Replace with your actual API key

  chatHistory: { user: string, bot: string }[] = [];
  userMessage: string = '';
  isOpen: boolean = false; // ✅ FIX: Add this property



  constructor(private http: HttpClient) {}


  toggleChat() {
    this.isOpen = !this.isOpen;
  }
  
  sendMessage() {
    console.log("📥 User Input:", this.userMessage);
    if (!this.userMessage.trim()) {
      console.warn("❗ Empty user message. Ignoring request.");
      return;
    }

    

    const userInput = this.userMessage.trim();
    this.chatHistory.push({ user: userInput, bot: "Thinking..." });

    const requestBody = {
      contents: [{ role: "user", parts: [{ text: userInput }] }]
    };

    this.http.post<any>(`${this.apiUrl}?key=${this.apiKey}`, requestBody)
      .subscribe(
        response => {
          console.log("✅ API Response:", response);
          const botReply = response?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
          this.chatHistory.pop();
          this.chatHistory.push({ user: userInput, bot: botReply });
        },
        error => {
          console.error("❌ API Error:", error);
          this.chatHistory.pop();
          this.chatHistory.push({ user: userInput, bot: "Error connecting to chatbot. Try again later." });
        }
      );

    this.userMessage = '';
  }
}
