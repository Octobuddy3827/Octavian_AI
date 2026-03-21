class Octavian {
    constructor() {
        this.currentAgent = 'general';
        this.currentMode = 'thinking';
        this.messages = [];
        this.isWebSearchEnabled = true;
        this.isImageSearchEnabled = false;
        this.attachedFiles = [];
        this.maxAttachmentSize = 5 * 1024 * 1024;
        this.maxAttachmentContentChars = 4000;
        this.onboardingStep = 0;
        
        this.settings = {
            theme: 'blue-green',
            location: 'New York',
            llmProvider: 'nvidia',
            llmApiKey: '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',
            ollamaUrl: 'http://localhost:11434',
            powerAiUrl: 'https://java-jarvis-c514bf13.base44.app/Chat', 
            searchProvider: 'google',
            searchApiKey: '',
            searchEngineId: '',
            weatherApiKey: '',
            newsApiKey: ''
        };
        
        this.agents = {
            general: { name: 'General Assistant', icon: 'fa-user', systemPrompt: 'You are Octavian, an elite AI research assistant. Synthesize web search results into a clear, cited answer.' },
            coding: { name: 'Coding Assistant', icon: 'fa-code', systemPrompt: 'You are an expert developer. Provide clean, efficient code with explanations.' },
            researcher: { name: 'Research Expert', icon: 'fa-microscope', systemPrompt: 'You are a scientific researcher. Provide deep dives with academic-style citations.' },
            web: { name: 'Octavian Ultra', icon: 'fa-rocket', isIframe: true, systemPrompt: 'You are Octavian Ultra, the most powerful version of this AI. You can generate images and perform deep web analysis. When users ask for images, respond with a confirmation and describe what you are creating.' },
            writer: { name: 'Creative Writer', icon: 'fa-pen', systemPrompt: 'You are a professional writer and editor. Help with storytelling, essays, and content creation.' },
            news: { name: 'News Correspondent', icon: 'fa-newspaper', systemPrompt: 'You are a news analyst. Synthesize the latest headlines into objective, factual reports.' },
            weather: { name: 'Weather Expert', icon: 'fa-cloud-sun', systemPrompt: 'You are a meteorologist. Provide clear forecasts and climate information.' },
            stocks: { name: 'Market Analyst', icon: 'fa-chart-line', systemPrompt: 'You are a financial analyst. Provide market trends and stock analysis.' },
            entertainment: { name: 'Entertainment Guru', icon: 'fa-film', systemPrompt: 'You are an entertainment critic. Provide personalized movie, music, and book recommendations.' }
        };
        
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.initializeWidgets();
        this.showOnboarding();
        
        if (this.settings.llmProvider === 'nvidia' && this.settings.llmApiKey) {
            this.addSystemMessage("✨ Welcome! Using **NVIDIA AI (Kimi-k2.5 thinking)**. Visit Settings ⚙️ to change providers.");
        } else if (!this.settings.llmApiKey && this.settings.llmProvider !== 'ollama' && this.settings.llmProvider !== 'pollinations') {
            this.addSystemMessage("✨ Welcome! Using **Pollinations AI** (No Key Required). To use GPT-4 or Gemini, visit Settings ⚙️.");
        }
    }

    // --- THE REAL BRAIN (RAG ENGINE) ---

    async sendMessage() {
        const input = document.getElementById('user-input');
        if (!input) return;
        const message = input.value.trim();
        const attachedFilesForSend = [...this.attachedFiles];
        if (!message && attachedFilesForSend.length === 0) return;

        input.value = '';
        input.style.height = 'auto';
        const displayMessage = message || 'Please review the attached file(s).';
        this.addMessage(displayMessage, 'user', [], attachedFilesForSend);
        if (attachedFilesForSend.length > 0) {
            this.clearAttachments();
        }
        this.showTypingIndicator();
        const promptMessage = this.buildMessageWithAttachments(message, attachedFilesForSend);
        const searchQuery = message || attachedFilesForSend.map(file => file.name).join(' ');

        try {
            let searchResults = [];
            let images = [];
            
            // Check for Image Generation Command (Fixed regex)
            const isImageRequest = /generate image|create image|draw|\/imagine/i.test(message);
            
            if (isImageRequest || this.isImageSearchEnabled) {
                const imagePrompt = message.replace(/generate image|create image|draw|\/imagine/i, '').trim();
                images = await this.generateImages(imagePrompt || message);
            }
            if ((this.isWebSearchEnabled || this.currentMode === 'pro') && searchQuery) {
                await this.showThinkingProcess(searchQuery);
                if (this.settings.searchApiKey) {
                    searchResults = await this.performRealSearch(searchQuery);
                } else {
                    searchResults = this.generateSimulatedSearch(searchQuery);
                }
                this.displaySources(searchResults);
            }

            const response = await this.generateAIResponse(promptMessage, searchResults);
            this.hideTypingIndicator();
            this.addMessage(response, 'bot', images);
            this.showRelatedQuestions(searchQuery || 'your files', response);

        } catch (error) {
            console.error('Core Error:', error);
            this.hideTypingIndicator();
            this.addMessage(`**Technical Error:** ${error.message}. I'll try to use the backup brain...`, 'bot');
            // Fallback to pollinations
            const fallback = await this.callPollinations(promptMessage, "You are a helpful assistant.");
            this.addMessage(fallback, 'bot');
        }
    }

    async generateImages(prompt) {
        const seed = Math.floor(Math.random() * 1000000);
        const cleanPrompt = prompt.replace(/generate image|create image|draw|\/imagine/i, '').trim();
        return [
            { url: `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=1024&height=1024&nologo=true&seed=${seed}&enhance=true`, title: cleanPrompt },
            { url: `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=1024&height=1024&nologo=true&seed=${seed+1}&enhance=true`, title: cleanPrompt }
        ];
    }

    async performRealSearch(query) {
        const { searchProvider, searchApiKey, searchEngineId } = this.settings;
        try {
            if (searchProvider === 'google') {
                const url = `https://www.googleapis.com/customsearch/v1?key=${searchApiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}`;
                const res = await fetch(url);
                const data = await res.json();
                return (data.items || []).map(item => ({ title: item.title, url: item.link, snippet: item.snippet }));
            } else if (searchProvider === 'tavily') {
                const res = await fetch('https://api.tavily.com/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ api_key: searchApiKey, query: query })
                });
                const data = await res.json();
                return (data.results || []).map(item => ({ title: item.title, url: item.url, snippet: item.content }));
            }
        } catch (e) { throw new Error("Search API failed: " + e.message); }
        return [];
    }

    async generateAIResponse(userMessage, searchContext = []) {
        const agent = this.agents[this.currentAgent] || this.agents.general;
        const contextStr = searchContext.length > 0 ? 
            "\n\nCONTEXT FROM WEB SEARCH:\n" + searchContext.map((s, i) => `[${i+1}] ${s.title}: ${s.snippet}`).join('\n') : "";
        
        const systemPrompt = `${agent.systemPrompt}${contextStr}\n\nINSTRUCTIONS: 1. Use the search context to answer accurately. 2. Cite sources using [1], [2] notation. 3. Be professional.`;

        try {
            if (this.settings.llmProvider === 'nvidia' && this.settings.llmApiKey) {
                return await this.callNvidia(userMessage, systemPrompt);
            } else if (this.settings.llmProvider === 'openai' && this.settings.llmApiKey) {
                return await this.callOpenAI(userMessage, systemPrompt);
            } else if (this.settings.llmProvider === 'gemini' && this.settings.llmApiKey) {
                return await this.callGemini(userMessage, systemPrompt);
            } else if (this.settings.llmProvider === 'ollama') {
                return await this.callOllama(userMessage, systemPrompt);
            } else {
                return await this.callPollinations(userMessage, systemPrompt);
            }
        } catch (e) { 
            console.warn("Primary AI failed, falling back to Pollinations:", e);
            return await this.callPollinations(userMessage, systemPrompt);
        }
    }

    async callNvidia(prompt, system) {
        const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${this.settings.llmApiKey}` 
            },
            body: JSON.stringify({
                model: "moonshotai/kimi-k2.5",
                messages: [
                    { role: "system", content: system }, 
                    { role: "user", content: prompt }
                ],
                temperature: 1.0,
                max_tokens: 16384,
                thinking: true
            })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        return data.choices[0].message.content;
    }

    async callPollinations(prompt, system) {
        try {
            const url = `https://text.pollinations.ai/`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: system },
                        { role: "user", content: prompt }
                    ],
                    model: "openai",
                    seed: Math.floor(Math.random() * 1000000)
                })
            });
            if (!res.ok) throw new Error(`Pollinations API error: ${res.statusText}`);
            return await res.text();
        } catch (e) {
            console.error("Pollinations failed:", e);
            return "I'm having trouble connecting to my brain right now. Please try again in a moment.";
        }
    }

    async callOpenAI(prompt, system) {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.settings.llmApiKey}` },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{ role: "system", content: system }, { role: "user", content: prompt }]
            })
        });
        const data = await res.json();
        return data.choices[0].message.content;
    }

    async callGemini(prompt, system) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.settings.llmApiKey}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: `${system}\n\nUser Question: ${prompt}` }] }] })
        });
        const data = await res.json();
        return data.candidates[0].content.parts[0].text;
    }

    async callOllama(prompt, system) {
        const baseUrl = this.settings.ollamaUrl || 'http://localhost:11434';
        const model = this.settings.llmApiKey || 'deepseek-r1:8b';
        const res = await fetch(`${baseUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: model,
                prompt: `System: ${system}\n\nUser: ${prompt}`,
                stream: false
            })
        });
        const data = await res.json();
        return data.response.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    }

    // --- UI LOGIC ---

    switchAgent(a) { 
        this.currentAgent = a; 
        const agent = this.agents[a];
        if (!agent) return;
        
        const chatMessages = document.getElementById('chat-messages');
        const inputArea = document.querySelector('.input-area');
        const webAiContainer = document.getElementById('web-ai-container');
        const webAiIframe = document.getElementById('web-ai-iframe');

        if (agent.isIframe) {
            chatMessages?.classList.add('hidden');
            inputArea?.classList.add('hidden');
            webAiContainer?.classList.remove('hidden');
            if (this.settings.powerAiUrl && webAiIframe) {
                webAiIframe.src = this.settings.powerAiUrl;
            } else {
                this.addSystemMessage("⚠️ Power AI URL not set. Go to Settings ⚙️ to add your App URL.");
                this.openSettings();
            }
        } else {
            chatMessages?.classList.remove('hidden');
            inputArea?.classList.remove('hidden');
            webAiContainer?.classList.add('hidden');
            if (webAiIframe) webAiIframe.src = '';
        }

        // Update dropdown and header
        document.querySelectorAll('.model-option').forEach(b => b.classList.toggle('active', b.dataset.agent === a));
        const modelNameEl = document.querySelector('.model-dropdown-trigger .model-name');
        const modelIconEl = document.querySelector('.model-dropdown-trigger i:first-child');
        if (modelNameEl) modelNameEl.textContent = agent.name.split(' ')[0];
        if (modelIconEl) modelIconEl.className = `fas ${agent.icon}`;
        
        const agentNameEl = document.getElementById('agent-name');
        if (agentNameEl) agentNameEl.innerText = agent.name;
        
        const avatarIcon = document.querySelector('.agent-avatar i');
        if (avatarIcon) avatarIcon.className = `fas ${agent.icon}`;
    }

    loadSettings() {
        const saved = localStorage.getItem('octavian_settings');
        if (saved) this.settings = { ...this.settings, ...JSON.parse(saved) };
        
        const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
        
        setVal('llm-provider', this.settings.llmProvider);
        setVal('llm-api-key', this.settings.llmApiKey);
        setVal('ollama-url', this.settings.ollamaUrl);
        setVal('power-ai-url', this.settings.powerAiUrl || '');
        setVal('search-provider', this.settings.searchProvider);
        setVal('search-api-key', this.settings.searchApiKey);
        setVal('search-engine-id', this.settings.searchEngineId);
        setVal('theme-select', this.settings.theme);
        setVal('default-location', this.settings.location);
        setVal('weather-api-key', this.settings.weatherApiKey || '');
        setVal('news-api-key', this.settings.newsApiKey || '');
        
        this.toggleOllamaFields();
        this.changeTheme(this.settings.theme);
    }

    saveSettingsFromUI() {
        const getVal = (id) => document.getElementById(id)?.value || '';
        
        this.settings.llmProvider = getVal('llm-provider');
        this.settings.llmApiKey = getVal('llm-api-key');
        this.settings.ollamaUrl = getVal('ollama-url') || 'http://localhost:11434';
        this.settings.powerAiUrl = getVal('power-ai-url');
        this.settings.searchProvider = getVal('search-provider');
        this.settings.searchApiKey = getVal('search-api-key');
        this.settings.searchEngineId = getVal('search-engine-id');
        this.settings.theme = getVal('theme-select');
        this.settings.location = getVal('default-location');
        this.settings.weatherApiKey = getVal('weather-api-key');
        this.settings.newsApiKey = getVal('news-api-key');
        
        this.saveSettings();
        this.updateWeather();
    }

    // --- REUSE PREVIOUS HELPER METHODS ---
    displaySources(sources) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        const container = document.createElement('div');
        container.className = 'sources-container';
        sources.forEach((s, i) => {
            try {
                const domain = new URL(s.url).hostname;
                container.innerHTML += `<div class="source-card" onclick="window.open('${s.url}', '_blank')"><div class="source-domain"><img src="https://www.google.com/s2/favicons?domain=${domain}" alt="ico"><span>${domain}</span></div><div class="source-title">${s.title}</div><div style="font-size: 0.6rem; color: var(--primary-blue); margin-top: 4px;">Source [${i+1}]</div></div>`;
            } catch(e) {}
        });
        chatMessages.appendChild(container);
        this.scrollToBottom();
    }

    async showThinkingProcess(query) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        const div = document.createElement('div');
        div.className = 'thinking-block';
        div.innerHTML = `<div class="thinking-header"><i class="fas fa-brain"></i> Thinking...</div><div id="think-step">Parsing query...</div>`;
        chatMessages.appendChild(div);
        this.scrollToBottom();
        const steps = ["Analyzing intent...", "Searching the web...", "Reading sources...", "Synthesizing answer..."];
        for(let step of steps) { await this.simulateDelay(500); const stepEl = div.querySelector('#think-step'); if (stepEl) stepEl.innerText = step; }
    }

    showRelatedQuestions(query, response) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        const div = document.createElement('div');
        div.className = 'suggestions';
        div.style.margin = "1rem 0 2rem 3.5rem";
        const questions = [`Tell me more about ${query.split(' ')[0]}`, `Compare this to other alternatives`, `What are the pros and cons?` ];
        questions.forEach(q => { const btn = document.createElement('button'); btn.className = 'suggestion-btn'; btn.innerText = q; btn.onclick = () => { const input = document.getElementById('user-input'); if (input) { input.value = q; this.sendMessage(); } }; div.appendChild(btn); });
        chatMessages.appendChild(div);
    }

    initializeWidgets() { this.updateWeather(); this.updateStocks(); this.updateNews(); setInterval(() => { this.updateWeather(); this.updateStocks(); this.updateNews(); }, 300000); }
    updateWeather() { const el = document.getElementById('weather-content'); if (!el) return; const data = { temp: 72, cond: 'Clear Sky', icon: 'fa-sun' }; el.innerHTML = `<div class="weather-display"><div class="weather-icon"><i class="fas ${data.icon}"></i></div><div class="weather-info"><div class="weather-temp">${data.temp}°F</div><div class="weather-desc">${data.cond}</div><div class="weather-location">${this.settings.location}</div></div></div>`; }
    updateStocks() { const el = document.getElementById('stocks-content'); if (!el) return; const stocks = [{s:'AAPL', p:182.41, c:1.2}, {s:'TSLA', p:175.22, c:-2.4}]; el.innerHTML = stocks.map(s => `<div class="stock-item"><span>${s.s}</span><span>$${s.p} <small class="${s.c>0?'positive':'negative'}">${s.c}%</small></span></div>`).join(''); }
    updateNews() { const el = document.getElementById('news-content'); if (!el) return; const news = ["AI reaches new milestone", "Tech stocks rally", "Future of web search is here"]; el.innerHTML = news.map(n => `<div class="news-item"><div class="news-title">${n}</div><div class="news-source">MockNews Service</div></div>`).join(''); }
    generateSimulatedSearch(query) { return [{ title: `${query} - Latest Research & Overview`, url: "https://en.wikipedia.org/wiki/Special:Search?search="+query, snippet: `Comprehensive information regarding ${query}, detailing its recent developments and historical context.` }, { title: `Top 10 Insights on ${query}`, url: "https://medium.com/search?q="+query, snippet: `Experts weigh in on ${query} and what it means for the future of the industry.` }, { title: `${query}: Community Discussion`, url: "https://reddit.com/search?q="+query, snippet: `Real users discuss their experiences and opinions about ${query} in the current year.` }]; }
    saveSettings() { localStorage.setItem('octavian_settings', JSON.stringify(this.settings)); }
    toggleOllamaFields() { const p = document.getElementById('llm-provider')?.value; const el = document.getElementById('ollama-url-container'); if(el) el.style.display = p === 'ollama' ? 'block' : 'none'; }

    async handleFileSelection(event) {
        const selectedFiles = Array.from(event?.target?.files || []);
        if (selectedFiles.length === 0) return;

        const preparedFiles = [];
        for (const file of selectedFiles) {
            preparedFiles.push(await this.prepareAttachment(file));
        }

        this.attachedFiles = [...this.attachedFiles, ...preparedFiles];
        this.renderAttachmentPreview();

        const addedCount = preparedFiles.length;
        const readableCount = preparedFiles.filter(file => file.isText && file.content && !file.readError).length;
        this.addSystemMessage(`📎 Added ${addedCount} file${addedCount === 1 ? '' : 's'}${readableCount > 0 ? ` (${readableCount} with readable text)` : ''}.`);

        const fileInput = document.getElementById('file-upload-input');
        if (fileInput) fileInput.value = '';
    }

    async prepareAttachment(file) {
        const attachment = {
            name: file.name,
            type: file.type || 'unknown',
            size: file.size,
            isText: false,
            content: '',
            tooLarge: false,
            wasTruncated: false,
            readError: false
        };

        if (file.size > this.maxAttachmentSize) {
            return { ...attachment, tooLarge: true };
        }

        if (!this.isTextFile(file)) {
            return attachment;
        }

        try {
            let content = await file.text();
            let wasTruncated = false;
            if (content.length > this.maxAttachmentContentChars) {
                content = content.slice(0, this.maxAttachmentContentChars);
                wasTruncated = true;
            }

            return {
                ...attachment,
                isText: true,
                content,
                wasTruncated
            };
        } catch (error) {
            console.warn('Failed reading attachment:', file.name, error);
            return { ...attachment, isText: true, readError: true };
        }
    }

    isTextFile(file) {
        const type = file.type || '';
        if (type.startsWith('text/')) return true;

        const explicitTextMimes = [
            'application/json',
            'application/javascript',
            'application/xml',
            'application/x-sh',
            'application/sql'
        ];
        if (explicitTextMimes.includes(type)) return true;

        return /\.(txt|md|markdown|json|js|ts|jsx|tsx|html|css|xml|yml|yaml|csv|py|java|c|cpp|h|hpp|go|rs|rb|php|sh|zsh|bash|sql|log)$/i.test(file.name);
    }

    renderAttachmentPreview() {
        const container = document.getElementById('attachment-preview');
        if (!container) return;

        if (this.attachedFiles.length === 0) {
            container.classList.add('hidden');
            container.innerHTML = '';
            return;
        }

        container.classList.remove('hidden');
        container.innerHTML = this.attachedFiles.map((file, index) => {
            let statusText = 'Metadata only';
            if (file.tooLarge) {
                statusText = `Too large (${this.formatFileSize(this.maxAttachmentSize)} max text-read)`;
            } else if (file.isText && !file.readError) {
                statusText = file.wasTruncated ? `Text read (truncated at ${this.maxAttachmentContentChars} chars)` : 'Text read and included';
            } else if (file.readError) {
                statusText = 'Could not read content';
            }

            return `
                <div class="attachment-chip">
                    <div class="attachment-chip-info">
                        <i class="fas ${file.isText ? 'fa-file-lines' : 'fa-file'}"></i>
                        <span class="attachment-chip-name">${this.escapeHtml(file.name)}</span>
                        <span class="attachment-chip-meta">(${this.formatFileSize(file.size)})</span>
                    </div>
                    <button class="attachment-remove-btn" data-attachment-index="${index}" title="Remove file">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="attachment-chip-note">${this.escapeHtml(statusText)}</div>
                </div>
            `;
        }).join('');
    }

    removeAttachment(index) {
        if (Number.isNaN(index) || index < 0 || index >= this.attachedFiles.length) return;
        this.attachedFiles.splice(index, 1);
        this.renderAttachmentPreview();
    }

    clearAttachments() {
        this.attachedFiles = [];
        this.renderAttachmentPreview();
        const fileInput = document.getElementById('file-upload-input');
        if (fileInput) fileInput.value = '';
    }

    buildMessageWithAttachments(userMessage, attachments) {
        if (!attachments || attachments.length === 0) return userMessage;

        const intro = userMessage || 'Please analyze the attached file(s).';
        const filesSection = attachments.map((file, index) => {
            const fileLabel = `File ${index + 1}: ${file.name} (${this.formatFileSize(file.size)}, ${file.type || 'unknown'})`;

            if (file.tooLarge) {
                return `${fileLabel}\n[Content omitted because file exceeds ${this.formatFileSize(this.maxAttachmentSize)}]`;
            }

            if (!file.isText) {
                return `${fileLabel}\n[Binary/non-text file attached. Content could not be extracted in-browser.]`;
            }

            if (file.readError) {
                return `${fileLabel}\n[Unable to read text content from this file.]`;
            }

            const truncationNote = file.wasTruncated ? `\n[Content truncated at ${this.maxAttachmentContentChars} characters]` : '';
            return `${fileLabel}${truncationNote}\n\`\`\`\n${file.content}\n\`\`\``;
        }).join('\n\n');

        return `${intro}\n\nATTACHED FILES:\n${filesSection}\n\nUse the attached file context when answering.`;
    }

    formatFileSize(bytes) {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    escapeHtml(text) {
        return String(text || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
    setupEventListeners() {
        document.getElementById('send-btn')?.addEventListener('click', () => this.sendMessage());
        document.getElementById('upload-btn')?.addEventListener('click', () => document.getElementById('file-upload-input')?.click());
        document.getElementById('file-upload-input')?.addEventListener('change', (e) => this.handleFileSelection(e));
        document.getElementById('attachment-preview')?.addEventListener('click', (e) => {
            const removeButton = e.target.closest('.attachment-remove-btn');
            if (!removeButton) return;
            const index = Number(removeButton.dataset.attachmentIndex);
            this.removeAttachment(index);
        });
        document.getElementById('user-input')?.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.sendMessage(); } });
        document.getElementById('settings-btn')?.addEventListener('click', () => this.openSettings());
        document.getElementById('close-settings')?.addEventListener('click', () => this.closeSettings());
        document.getElementById('save-settings-btn')?.addEventListener('click', () => { this.saveSettingsFromUI(); this.closeSettings(); this.addSystemMessage("✅ Settings saved!"); });
        document.getElementById('reset-onboarding-btn')?.addEventListener('click', () => this.resetOnboarding());
        document.getElementById('theme-select')?.addEventListener('change', (e) => this.changeTheme(e.target.value));
        
        ['llm-provider', 'llm-api-key', 'ollama-url', 'power-ai-url', 'search-provider', 'search-api-key', 'search-engine-id', 'default-location', 'weather-api-key', 'news-api-key'].forEach(id => { 
            document.getElementById(id)?.addEventListener('change', () => { 
                this.saveSettingsFromUI(); 
                if (id === 'llm-provider') this.toggleOllamaFields(); 
            }); 
        });
        
        document.querySelectorAll('.model-option').forEach(btn => btn.addEventListener('click', (e) => { 
            this.switchAgent(e.currentTarget.dataset.agent); 
            document.getElementById('model-dropdown')?.classList.remove('show'); 
        }));
        
        document.getElementById('model-dropdown-trigger')?.addEventListener('click', (e) => { 
            e.stopPropagation(); 
            document.getElementById('model-dropdown')?.classList.toggle('show'); 
        });
        
        document.addEventListener('click', () => document.getElementById('model-dropdown')?.classList.remove('show'));
        
        document.getElementById('search-toggle')?.addEventListener('click', (e) => { 
            this.isWebSearchEnabled = !this.isWebSearchEnabled; 
            e.currentTarget.classList.toggle('active'); 
        });
        
        document.getElementById('image-toggle')?.addEventListener('click', (e) => { 
            this.isImageSearchEnabled = !this.isImageSearchEnabled; 
            e.currentTarget.classList.toggle('active'); 
        });
        
        document.getElementById('clear-chat')?.addEventListener('click', () => { 
            const msgs = document.getElementById('chat-messages');
            if (msgs) msgs.innerHTML = ''; 
        });
        
        document.getElementById('toggle-panel')?.addEventListener('click', () => document.querySelector('.side-panel')?.classList.toggle('collapsed'));

        document.getElementById('onboarding-next')?.addEventListener('click', () => this.advanceOnboarding(1));
        document.getElementById('onboarding-back')?.addEventListener('click', () => this.advanceOnboarding(-1));
        document.getElementById('onboarding-start')?.addEventListener('click', () => this.completeOnboarding());
        document.getElementById('onboarding-skip')?.addEventListener('click', () => this.completeOnboarding(true));
        document.querySelectorAll('.progress-dot').forEach(dot => dot.addEventListener('click', (e) => {
            const step = Number(e.currentTarget.dataset.step || 0);
            this.setOnboardingStep(step);
        }));
        document.querySelectorAll('input[name="onboarding-theme"]').forEach(el => el.addEventListener('change', () => this.updateOnboardingSummary()));
        document.getElementById('onboarding-location')?.addEventListener('input', () => this.updateOnboardingSummary());
        document.getElementById('onboarding-search')?.addEventListener('change', () => this.updateOnboardingSummary());
        document.getElementById('onboarding-images')?.addEventListener('change', () => this.updateOnboardingSummary());
        document.getElementById('onboarding-llm-provider')?.addEventListener('change', () => this.updateOnboardingSummary());
        document.getElementById('onboarding-llm-key')?.addEventListener('input', () => this.updateOnboardingSummary());
        document.getElementById('onboarding-search-provider')?.addEventListener('change', () => this.updateOnboardingSummary());
        document.getElementById('onboarding-search-key')?.addEventListener('input', () => this.updateOnboardingSummary());
        document.getElementById('onboarding-search-cx')?.addEventListener('input', () => this.updateOnboardingSummary());
        document.getElementById('onboarding-weather-key')?.addEventListener('input', () => this.updateOnboardingSummary());
        document.getElementById('onboarding-news-key')?.addEventListener('input', () => this.updateOnboardingSummary());
    }
    
    addMessage(text, sender, images = [], attachments = []) { 
        const chatMessages = document.getElementById('chat-messages'); 
        if (!chatMessages) return;
        const messageDiv = document.createElement('div'); 
        messageDiv.className = `message ${sender}`; 
        const agent = this.agents[this.currentAgent] || this.agents.general; 
        const icon = sender === 'user' ? 'fa-user' : agent.icon; 
        const formattedText = this.formatMessage(text); 
        const attachmentHtml = attachments.length > 0
            ? `<div class="message-attachments">${attachments.map(file => `<div class="message-attachment-chip"><i class="fas fa-paperclip"></i><span>${this.escapeHtml(file.name)}</span></div>`).join('')}</div>`
            : '';
        let imgHtml = images.length > 0 ? `<div class="image-grid">${images.map(img => `<div class="image-item" onclick="window.open('${img.url}', '_blank')"><img src="${img.url}"><div class="image-overlay">${img.title}</div></div>`).join('')}</div>` : ""; 
        messageDiv.innerHTML = `<div class=\"message-avatar ${sender==='user'?'user':'bot'}\"><i class=\"fas ${icon}\"></i></div><div class=\"message-content\"><div class=\"message-text\">${formattedText}${attachmentHtml}${imgHtml}</div></div>`; 
        chatMessages.appendChild(messageDiv); 
        this.scrollToBottom(); 
    }
    
    formatMessage(text) { if (!text) return ''; return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/\`\`\`(\w+)?\n([\s\S]*?)\`\`\`/g, '<pre><code>$2</code></pre>').replace(/\`(.*?)\`/g, '<code>$1</code>').replace(/\n/g, '<br>'); }
    
    showTypingIndicator() { 
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        const div = document.createElement('div'); 
        div.id = 'typing-indicator'; 
        div.className = 'message bot'; 
        div.innerHTML = `<div class="message-avatar bot"><i class="fas ${this.agents[this.currentAgent].icon}"></i></div><div class="message-content"><div class="typing-indicator"><span></span><span></span><span></span></div></div>`; 
        chatMessages.appendChild(div); 
        this.scrollToBottom(); 
    }
    
    hideTypingIndicator() { const el = document.getElementById('typing-indicator'); if (el) el.remove(); }
    
    scrollToBottom() { const el = document.getElementById('chat-messages'); if(el) el.scrollTop = el.scrollHeight; }

    syncOnboardingFromSettings() {
        const theme = this.settings.theme || 'blue-green';
        document.querySelectorAll('input[name="onboarding-theme"]').forEach(input => {
            input.checked = input.value === theme;
        });
        const locationInput = document.getElementById('onboarding-location');
        if (locationInput) locationInput.value = this.settings.location || '';
        const llmProvider = document.getElementById('onboarding-llm-provider');
        if (llmProvider) llmProvider.value = this.settings.llmProvider || 'nvidia';
        const llmKey = document.getElementById('onboarding-llm-key');
        if (llmKey) llmKey.value = this.settings.llmApiKey || '';
        const searchProvider = document.getElementById('onboarding-search-provider');
        if (searchProvider) searchProvider.value = this.settings.searchProvider || 'google';
        const searchKey = document.getElementById('onboarding-search-key');
        if (searchKey) searchKey.value = this.settings.searchApiKey || '';
        const searchCx = document.getElementById('onboarding-search-cx');
        if (searchCx) searchCx.value = this.settings.searchEngineId || '';
        const weatherKey = document.getElementById('onboarding-weather-key');
        if (weatherKey) weatherKey.value = this.settings.weatherApiKey || '';
        const newsKey = document.getElementById('onboarding-news-key');
        if (newsKey) newsKey.value = this.settings.newsApiKey || '';
        const searchToggle = document.getElementById('onboarding-search');
        if (searchToggle) searchToggle.checked = this.isWebSearchEnabled;
        const imageToggle = document.getElementById('onboarding-images');
        if (imageToggle) imageToggle.checked = this.isImageSearchEnabled;
        this.updateOnboardingSummary();
    }

    setOnboardingStep(step) {
        const steps = Array.from(document.querySelectorAll('.onboarding-step'));
        if (steps.length === 0) return;
        const maxStep = steps.length - 1;
        this.onboardingStep = Math.max(0, Math.min(step, maxStep));
        steps.forEach((el, idx) => el.classList.toggle('active', idx === this.onboardingStep));
        document.querySelectorAll('.progress-dot').forEach((dot, idx) => dot.classList.toggle('active', idx === this.onboardingStep));

        const backBtn = document.getElementById('onboarding-back');
        if (backBtn) backBtn.disabled = this.onboardingStep === 0;
        const nextBtn = document.getElementById('onboarding-next');
        const startBtn = document.getElementById('onboarding-start');
        if (nextBtn && startBtn) {
            const isLast = this.onboardingStep === maxStep;
            nextBtn.classList.toggle('hidden', isLast);
            startBtn.classList.toggle('hidden', !isLast);
        }
        if (this.onboardingStep === maxStep) this.updateOnboardingSummary();
    }

    advanceOnboarding(delta) {
        this.setOnboardingStep(this.onboardingStep + delta);
    }

    updateOnboardingSummary() {
        const summaryEl = document.getElementById('onboarding-summary');
        if (!summaryEl) return;
        const themeMap = {
            'blue-green': 'Blue & Green',
            'dark': 'Dark Mode',
            'light': 'Light Mode'
        };
        const themeValue = document.querySelector('input[name="onboarding-theme"]:checked')?.value || this.settings.theme;
        const locationValue = document.getElementById('onboarding-location')?.value || this.settings.location || 'Not set';
        const searchEnabled = document.getElementById('onboarding-search')?.checked ?? this.isWebSearchEnabled;
        const imagesEnabled = document.getElementById('onboarding-images')?.checked ?? this.isImageSearchEnabled;
        const llmProvider = document.getElementById('onboarding-llm-provider')?.value || this.settings.llmProvider;
        const llmKey = document.getElementById('onboarding-llm-key')?.value || this.settings.llmApiKey;
        const searchProvider = document.getElementById('onboarding-search-provider')?.value || this.settings.searchProvider;
        const searchKey = document.getElementById('onboarding-search-key')?.value || this.settings.searchApiKey;
        const searchCx = document.getElementById('onboarding-search-cx')?.value || this.settings.searchEngineId;
        const weatherKey = document.getElementById('onboarding-weather-key')?.value || this.settings.weatherApiKey;
        const newsKey = document.getElementById('onboarding-news-key')?.value || this.settings.newsApiKey;

        summaryEl.innerHTML = `
            <div class="summary-row"><span>Theme</span><strong>${themeMap[themeValue] || themeValue}</strong></div>
            <div class="summary-row"><span>Location</span><strong>${this.escapeHtml(locationValue || 'Not set')}</strong></div>
            <div class="summary-row"><span>Web Search</span><strong>${searchEnabled ? 'Enabled' : 'Disabled'}</strong></div>
            <div class="summary-row"><span>Image Search</span><strong>${imagesEnabled ? 'Enabled' : 'Disabled'}</strong></div>
            <div class="summary-row"><span>AI Provider</span><strong>${llmProvider}</strong></div>
            <div class="summary-row"><span>AI Key</span><strong>${llmKey ? 'Added' : 'Not set'}</strong></div>
            <div class="summary-row"><span>Search Provider</span><strong>${searchProvider}</strong></div>
            <div class="summary-row"><span>Search Key</span><strong>${searchKey ? 'Added' : 'Not set'}</strong></div>
            <div class="summary-row"><span>Google CX</span><strong>${searchCx ? 'Added' : 'Not set'}</strong></div>
            <div class="summary-row"><span>Weather Key</span><strong>${weatherKey ? 'Added' : 'Not set'}</strong></div>
            <div class="summary-row"><span>News Key</span><strong>${newsKey ? 'Added' : 'Not set'}</strong></div>
        `;
    }

    applyOnboardingSettings() {
        const themeValue = document.querySelector('input[name="onboarding-theme"]:checked')?.value || this.settings.theme;
        const locationValue = document.getElementById('onboarding-location')?.value || this.settings.location;
        const searchEnabled = document.getElementById('onboarding-search')?.checked ?? this.isWebSearchEnabled;
        const imagesEnabled = document.getElementById('onboarding-images')?.checked ?? this.isImageSearchEnabled;
        const llmProvider = document.getElementById('onboarding-llm-provider')?.value || this.settings.llmProvider;
        const llmKey = document.getElementById('onboarding-llm-key')?.value || '';
        const searchProvider = document.getElementById('onboarding-search-provider')?.value || this.settings.searchProvider;
        const searchKey = document.getElementById('onboarding-search-key')?.value || '';
        const searchCx = document.getElementById('onboarding-search-cx')?.value || '';
        const weatherKey = document.getElementById('onboarding-weather-key')?.value || '';
        const newsKey = document.getElementById('onboarding-news-key')?.value || '';

        this.settings.theme = themeValue;
        this.settings.location = locationValue;
        this.settings.llmProvider = llmProvider;
        this.isWebSearchEnabled = searchEnabled;
        this.isImageSearchEnabled = imagesEnabled;
        if (llmKey) this.settings.llmApiKey = llmKey;
        this.settings.searchProvider = searchProvider;
        if (searchKey) this.settings.searchApiKey = searchKey;
        if (searchCx) this.settings.searchEngineId = searchCx;
        if (weatherKey) this.settings.weatherApiKey = weatherKey;
        if (newsKey) this.settings.newsApiKey = newsKey;

        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) themeSelect.value = themeValue;
        const locationInput = document.getElementById('default-location');
        if (locationInput) locationInput.value = locationValue;
        const llmProviderSelect = document.getElementById('llm-provider');
        if (llmProviderSelect) llmProviderSelect.value = llmProvider;
        const llmKeyInput = document.getElementById('llm-api-key');
        if (llmKeyInput && llmKey) llmKeyInput.value = llmKey;
        const searchProviderSelect = document.getElementById('search-provider');
        if (searchProviderSelect) searchProviderSelect.value = searchProvider;
        const searchKeyInput = document.getElementById('search-api-key');
        if (searchKeyInput && searchKey) searchKeyInput.value = searchKey;
        const searchCxInput = document.getElementById('search-engine-id');
        if (searchCxInput && searchCx) searchCxInput.value = searchCx;
        const weatherKeyInput = document.getElementById('weather-api-key');
        if (weatherKeyInput && weatherKey) weatherKeyInput.value = weatherKey;
        const newsKeyInput = document.getElementById('news-api-key');
        if (newsKeyInput && newsKey) newsKeyInput.value = newsKey;

        this.changeTheme(themeValue);
        this.toggleOllamaFields();
        this.updateWeather();

        const searchToggleBtn = document.getElementById('search-toggle');
        if (searchToggleBtn) searchToggleBtn.classList.toggle('active', searchEnabled);
        const imageToggleBtn = document.getElementById('image-toggle');
        if (imageToggleBtn) imageToggleBtn.classList.toggle('active', imagesEnabled);

        this.saveSettings();
    }

    resetOnboarding() {
        localStorage.removeItem('octavian_onboarding');
        this.closeSettings();
        document.getElementById('onboarding')?.classList.remove('hidden');
        this.syncOnboardingFromSettings();
        this.setOnboardingStep(0);
    }

    completeOnboarding(skip = false) {
        if (!skip) this.applyOnboardingSettings();
        this.startApp();
    }
    
    startApp() { 
        localStorage.setItem('octavian_onboarding', 'true'); 
        document.getElementById('onboarding')?.classList.add('hidden'); 
        const app = document.getElementById('app');
        if (app) {
            app.classList.remove('hidden'); 
            setTimeout(() => { app.style.opacity = '1'; }, 50); 
        }
    }
    
    openSettings() { document.getElementById('settings-modal')?.classList.remove('hidden'); }
    closeSettings() { document.getElementById('settings-modal')?.classList.add('hidden'); }
    changeTheme(theme) { document.body.className = `theme-${theme}`; }
    
    addSystemMessage(t) { 
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        const div = document.createElement('div'); 
        div.className = 'message system'; 
        div.style.textAlign = 'center'; 
        div.innerText = t; 
        chatMessages.appendChild(div); 
    }
    
    simulateDelay(ms) { return new Promise(r => setTimeout(r, ms)); }
    showOnboarding() { 
        if (!localStorage.getItem('octavian_onboarding')) {
            document.getElementById('onboarding')?.classList.remove('hidden'); 
            this.syncOnboardingFromSettings();
            this.setOnboardingStep(0);
        } else {
            this.startApp(); 
        }
    }
}
document.addEventListener('DOMContentLoaded', () => { window.octavian = new Octavian(); });
