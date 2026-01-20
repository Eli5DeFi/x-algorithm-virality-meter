'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ContentInputProps {
  onAnalyze: (
    content: string,
    hasMedia: boolean,
    mediaType: string,
    videoDuration?: number
  ) => void;
  loading: boolean;
}

export default function ContentInput({ onAnalyze, loading }: ContentInputProps) {
  const [content, setContent] = useState('');
  const [hasMedia, setHasMedia] = useState(false);
  const [mediaType, setMediaType] = useState('none');
  const [videoDuration, setVideoDuration] = useState<number | undefined>();

  const charCount = content.length;
  const isOverLimit = charCount > 280;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onAnalyze(content, hasMedia, mediaType, videoDuration);
    }
  };

  const examplePosts = [
    { label: 'Hot Take', text: 'Unpopular opinion: Tabs are better than spaces and I will die on this hill. Fight me.' },
    { label: 'Thread', text: 'Thread: 10 things I learned building a startup that nobody talks about 🧵\n\n1/ Most "overnight successes" took 10 years...' },
    { label: 'Question', text: 'What\'s the one piece of advice you wish someone gave you when you started your career? I\'ll go first...' },
    { label: 'Meme', text: 'Me: I\'ll just check Twitter for 5 minutes\n\n*3 hours later*\n\nMe: How did I end up watching a thread about the history of doorknobs?' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Terminal prompt */}
      <div className="flex items-center gap-2 text-xs text-term-gray font-mono">
        <span className="text-term-green">$</span>
        <span>input_content</span>
        <span className="animate-blink text-term-green">█</span>
      </div>

      {/* Text Input */}
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter tweet content to analyze..."
          className={`terminal-input w-full h-28 resize-none text-sm ${
            isOverLimit ? 'border-term-red' : ''
          }`}
          disabled={loading}
        />
        <div className={`absolute bottom-2 right-2 text-xs font-mono ${
          isOverLimit ? 'text-term-red' : charCount > 250 ? 'text-term-amber' : 'text-term-gray'
        }`}>
          {charCount}/280
        </div>
      </div>

      {/* Quick Examples */}
      <div className="flex flex-wrap gap-1.5">
        <span className="text-xs text-term-gray font-mono">templates:</span>
        {examplePosts.map((example, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setContent(example.text)}
            className="text-xs px-2 py-0.5 bg-term-bg border border-term-border rounded text-term-gray hover:text-term-green hover:border-term-green-dim transition-colors font-mono"
          >
            {example.label}
          </button>
        ))}
      </div>

      {/* Media Options */}
      <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={hasMedia}
            onChange={(e) => {
              setHasMedia(e.target.checked);
              if (!e.target.checked) {
                setMediaType('none');
                setVideoDuration(undefined);
              }
            }}
            className="w-3 h-3 rounded-sm border-term-border bg-term-bg text-term-green focus:ring-0 focus:ring-offset-0"
          />
          <span className="text-term-gray hover:text-term-green transition-colors">--media</span>
        </label>

        {hasMedia && (
          <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value)}
              className="terminal-input py-1 px-2 text-xs"
            >
              <option value="image">image</option>
              <option value="video">video</option>
              <option value="gif">gif</option>
              <option value="poll">poll</option>
            </select>

            {mediaType === 'video' && (
              <input
                type="number"
                placeholder="duration_ms"
                value={videoDuration ? videoDuration / 1000 : ''}
                onChange={(e) => setVideoDuration(parseFloat(e.target.value) * 1000 || undefined)}
                className="terminal-input w-20 py-1 px-2 text-xs"
                min="1"
                max="600"
              />
            )}
          </motion.div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!content.trim() || loading}
        className="terminal-btn terminal-btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <>
            <span className="animate-spin">◌</span>
            <span>ANALYZING...</span>
          </>
        ) : (
          <>
            <span>&gt;</span>
            <span>ANALYZE_VIRALITY</span>
          </>
        )}
      </button>
    </form>
  );
}
