import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Bot, User, Minimize2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AimAiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Yo! I'm aimAi, your Virtual Master. Whether you need a doubt solved, a study plan, or just want to chat about life—I'm here. Aman built me to be your academic sensei and your roast-master friend. What's on your mind?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "My brain just glitched. Probably Aman's fault. Try again!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4"
          >
            <Card className="w-80 sm:w-96 h-[500px] flex flex-col bg-secondary/95 backdrop-blur-xl border-primary/20 shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-primary/20 bg-primary/10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-primary/20">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-sm">aimAi</h3>
                    <p className="text-[10px] text-primary/80 uppercase tracking-widest">Your Virtual Master</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">
                  <Minimize2 className="w-4 h-4" />
                </Button>
              </div>

              <ScrollArea className="flex-1 p-4 overflow-y-auto" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                        m.role === "user" 
                          ? "bg-primary text-black ml-4 rounded-tr-none" 
                          : "bg-white/10 text-white mr-4 rounded-tl-none border border-white/5"
                      }`}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none border border-white/5 animate-pulse text-white/50 text-xs">
                        aimAi is thinking...
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-primary/20 bg-black/20">
                <div className="flex gap-2">
                  <Input 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask your Master..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary"
                  />
                  <Button size="icon" onClick={handleSend} disabled={isLoading} className="bg-primary hover:bg-yellow-400 text-black">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="lg"
        onClick={() => setIsOpen(!isOpen)}
        className={`rounded-full h-14 w-14 shadow-2xl transition-all duration-300 ${isOpen ? 'rotate-90 bg-secondary border border-primary/20' : 'bg-primary hover:bg-yellow-400'}`}
      >
        {isOpen ? <X className="w-6 h-6 text-primary" /> : <MessageSquare className="w-6 h-6 text-black" />}
      </Button>
    </div>
  );
}
