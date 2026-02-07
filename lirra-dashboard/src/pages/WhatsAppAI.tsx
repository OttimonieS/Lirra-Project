import { useState } from "react";
import { MessageSquare, Send, Clock, Bot } from "lucide-react";
import type { WhatsAppMessage } from "../types";
import {
  initialMessages,
  workingHours,
  quickReplyTemplates,
  connectionStatus,
  autoReplyStats,
} from "../data/whatsappData";

const WhatsAppAI = () => {
  const [messages] = useState<WhatsAppMessage[]>(initialMessages);

  return (
    <div className="p-6 ml-0 md:ml-64">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            WhatsApp AI Reply
          </h1>
          <p className="text-gray-600">Automate customer responses with AI</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Connection Status */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">
                WhatsApp Connection
              </h3>
              <div
                className={`flex items-center justify-between p-4 border rounded-lg mb-4 ${
                  connectionStatus.isConnected
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${
                      connectionStatus.isConnected
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <span
                    className={`text-sm font-medium ${
                      connectionStatus.isConnected
                        ? "text-green-900"
                        : "text-red-900"
                    }`}
                  >
                    {connectionStatus.isConnected
                      ? "Connected"
                      : "Disconnected"}
                  </span>
                </div>
                <Bot
                  className={
                    connectionStatus.isConnected
                      ? "text-green-600"
                      : "text-red-600"
                  }
                  size={24}
                />
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Number: {connectionStatus.phoneNumber}</p>
                <p>Active since: {connectionStatus.activeSince}</p>
              </div>
              <button className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                Reconnect
              </button>
            </div>

            {/* Working Hours */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">
                <Clock size={18} className="inline mr-2" />
                Working Hours
              </h3>
              <div className="space-y-3">
                {workingHours.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm text-gray-700">
                      {schedule.day}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-hover transition-colors">
                Edit Hours
              </button>
            </div>

            {/* Quick Reply Templates */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">
                Quick Reply Templates
              </h3>
              <div className="space-y-2">
                {quickReplyTemplates.map((template) => (
                  <button
                    key={template.id}
                    className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
                    title={template.message}
                  >
                    {template.label}
                  </button>
                ))}
              </div>
              <button className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                + Add Template
              </button>
            </div>

            {/* AI Settings */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">AI Settings</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Auto Reply</span>
                  <input type="checkbox" defaultChecked className="w-10 h-5" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    Use Product Catalog
                  </span>
                  <input type="checkbox" defaultChecked className="w-10 h-5" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Multilingual</span>
                  <input type="checkbox" defaultChecked className="w-10 h-5" />
                </label>
              </div>
            </div>
          </div>

          {/* Conversation History */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-gray-900">
                  Recent Conversations
                </h3>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                    All
                  </button>
                  <button className="px-4 py-2 bg-primary-light text-primary rounded-lg text-sm font-medium">
                    Auto Replied
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                          <MessageSquare size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {msg.from}
                          </p>
                          <p className="text-xs text-gray-500">
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                      {msg.isAuto && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center">
                          <Bot size={12} className="mr-1" />
                          Auto
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 ml-13">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Customer:</strong> {msg.message}
                        </p>
                      </div>
                      {msg.reply && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <strong>Reply:</strong> {msg.reply}
                          </p>
                        </div>
                      )}
                      {!msg.reply && (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Type your reply..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                          />
                          <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors">
                            <Send size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">156</p>
                  <p className="text-sm text-gray-600">Total Chats</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">142</p>
                  <p className="text-sm text-gray-600">Auto Replied</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">91%</p>
                  <p className="text-sm text-gray-600">Success Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppAI;
