import React, { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, Heart, Sparkles, Video, Clock, Volume2, Plus } from 'lucide-react';

interface Tab {
    id: string;
    name: string;
    icon: React.ReactNode;
}

const Wellness: React.FC = () => {
    const [activeTab, setActiveTab] = useState('activity');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(0);

    const tabs: Tab[] = [
        { id: 'activity', name: 'Physical Activity', icon: <Heart size={20} /> },
        { id: 'music', name: 'Music & Relaxation', icon: <Music size={20} /> },
    ];

    const activities = [
        { title: 'Light Cardio', duration: '15 min', level: 'Beginner', image: 'https://images.unsplash.com/photo-1518622730142-71c1040f6043?q=80&w=400&h=250&auto=format&fit=crop' },
        { title: 'Stretching for Balance', duration: '10 min', level: 'Easy', image: 'https://images.unsplash.com/photo-1552196564-972b20464673?q=80&w=400&h=250&auto=format&fit=crop' },
        { title: 'Breathing Exercises', duration: '5 min', level: 'Any', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400&h=250&auto=format&fit=crop' },
    ];

    const playlist = [
        { title: 'Morning Forest', artist: 'Nature Sounds', duration: '5:32' },
        { title: 'Zen Meditation', artist: 'Calm Mind', duration: '10:00' },
        { title: 'Ocean Waves', artist: 'Deep Sleep', duration: '15:24' },
    ];

    return (
        <div className="wellness-page animate-fade-in">
            <header className="page-header">
                <h1>Wellness Center</h1>
                <p className="text-muted">Balance your body and mind</p>
            </header>

            <div className="tab-navigation glass">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.icon}
                        <span>{tab.name}</span>
                    </button>
                ))}
            </div>

            <div className="wellness-content">
                {activeTab === 'activity' ? (
                    <div className="activity-section">
                        <div className="section-header">
                            <h2>Diabetes-Friendly Exercises</h2>
                            <p className="text-muted">Low-intensity movements to help manage blood sugar.</p>
                        </div>

                        <div className="activity-grid">
                            {activities.map((act, i) => (
                                <div key={i} className="card activity-card">
                                    <div className="activity-image" style={{ backgroundImage: `url(${act.image})` }}>
                                        <div className="play-overlay"><Play fill="white" size={32} /></div>
                                    </div>
                                    <div className="activity-info">
                                        <h3>{act.title}</h3>
                                        <div className="act-meta">
                                            <span className="meta-item"><Clock size={14} /> {act.duration}</span>
                                            <span className="meta-item"><Video size={14} /> Video</span>
                                        </div>
                                        <button className="btn btn-outline w-full mt-4">Start Session</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="music-section">
                        <div className="music-layout">
                            <div className="player-card card">
                                <div className="player-visual">
                                    <div className={`disc ${isPlaying ? 'spinning' : ''}`}>
                                        <Music size={48} className="text-blue-primary" />
                                    </div>
                                </div>
                                <div className="track-info">
                                    <h3>{playlist[currentTrack].title}</h3>
                                    <p className="text-muted">{playlist[currentTrack].artist}</p>
                                </div>

                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: '35%' }}></div>
                                </div>

                                <div className="player-controls">
                                    <button className="ctrl-btn"><SkipBack size={24} /></button>
                                    <button className="play-btn" onClick={() => setIsPlaying(!isPlaying)}>
                                        {isPlaying ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" />}
                                    </button>
                                    <button className="ctrl-btn"><SkipForward size={24} /></button>
                                </div>

                                <div className="volume-ctrl">
                                    <Volume2 size={18} className="text-muted" />
                                    <div className="vol-slider"></div>
                                </div>
                            </div>

                            <div className="playlist-card card">
                                <div className="card-header">
                                    <h3>Relaxation Playlist</h3>
                                    <Sparkles size={18} className="text-yellow-primary" />
                                </div>
                                <div className="playlist-list">
                                    {playlist.map((track, i) => (
                                        <div
                                            key={i}
                                            className={`playlist-item ${currentTrack === i ? 'active' : ''}`}
                                            onClick={() => setCurrentTrack(i)}
                                        >
                                            <div className="track-num">{i + 1}</div>
                                            <div className="track-main">
                                                <span className="name">{track.title}</span>
                                                <span className="artist">{track.artist}</span>
                                            </div>
                                            <span className="duration">{track.duration}</span>
                                        </div>
                                    ))}
                                    <button className="btn dashed w-full mt-4">
                                        <Plus size={18} />
                                        <span>Upload Personal Music</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .wellness-page { display: flex; flex-direction: column; gap: 24px; }
        
        .tab-navigation { 
          display: flex; gap: 8px; padding: 6px; 
          border-radius: var(--radius-lg); width: fit-content;
          background: rgba(255, 255, 255, 0.5);
        }
        .tab-btn { 
          display: flex; align-items: center; gap: 10px; padding: 10px 20px;
          border-radius: var(--radius-md); border: none; background: none;
          cursor: pointer; font-weight: 600; color: var(--text-muted);
          transition: 0.2s;
        }
        .tab-btn.active { background: white; color: var(--blue-primary); box-shadow: var(--shadow-sm); }

        .activity-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-top: 24px; }
        .activity-card { padding: 0; overflow: hidden; }
        .activity-image { 
          height: 180px; background-size: cover; background-position: center; 
          position: relative; cursor: pointer; display: flex; align-items: center; justify-content: center;
        }
        .play-overlay { 
          width: 56px; height: 56px; border-radius: 50%; background: rgba(0,0,0,0.3);
          backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center;
          transition: 0.3s; opacity: 0;
        }
        .activity-card:hover .play-overlay { opacity: 1; transform: scale(1.1); }
        .activity-info { padding: 20px; }
        .act-meta { display: flex; gap: 16px; margin-top: 8px; color: var(--text-muted); font-size: 0.85rem; }
        .meta-item { display: flex; align-items: center; gap: 4px; }

        .btn-outline { background: none; border: 1px solid var(--border-color); color: var(--text-main); }
        .btn-outline:hover { background: var(--bg-app); }

        .music-layout { display: grid; grid-template-columns: 350px 1fr; gap: 24px; margin-top: 24px; }
        
        .player-card { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 32px; }
        .player-visual { 
          width: 200px; height: 200px; border-radius: 50%; 
          background: var(--bg-app); border: 8px solid white;
          box-shadow: var(--shadow-lg); display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px; position: relative;
        }
        .disc { 
          width: 160px; height: 160px; border-radius: 50%; 
          border: 1px dashed var(--blue-primary); display: flex; align-items: center; justify-content: center;
        }
        .spinning { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .track-info h3 { font-size: 1.25rem; margin-bottom: 4px; }
        .progress-bar { width: 100%; height: 6px; background: var(--bg-app); border-radius: 3px; margin: 24px 0; }
        .progress-fill { height: 100%; background: var(--blue-primary); border-radius: 3px; }

        .player-controls { display: flex; align-items: center; gap: 24px; }
        .ctrl-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; transition: 0.2s; }
        .ctrl-btn:hover { color: var(--blue-primary); }
        .play-btn { 
          width: 64px; height: 64px; border-radius: 50%; background: var(--blue-primary);
          border: none; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 12px hsla(200, 85%, 60%, 0.4); transition: 0.2s;
        }
        .play-btn:hover { transform: scale(1.05); }

        .volume-ctrl { display: flex; align-items: center; gap: 12px; width: 100%; margin-top: 32px; }
        .vol-slider { flex: 1; height: 4px; background: var(--border-color); border-radius: 2px; position: relative; }
        .vol-slider::after { content: ''; position: absolute; right: 0; left: 70%; top: 0; bottom: 0; background: var(--blue-primary); border-radius: 2px; }

        .playlist-list { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
        .playlist-item { 
          display: flex; align-items: center; gap: 16px; padding: 12px 16px;
          border-radius: var(--radius-md); cursor: pointer; transition: 0.2s;
        }
        .playlist-item:hover { background: var(--bg-app); }
        .playlist-item.active { background: var(--blue-soft); color: var(--blue-primary); }
        .track-num { font-size: 0.85rem; font-weight: 700; color: var(--text-muted); width: 20px; }
        .track-main { flex: 1; display: flex; flex-direction: column; }
        .track-main .name { font-weight: 600; font-size: 0.95rem; }
        .track-main .artist { font-size: 0.75rem; color: var(--text-muted); }
        .playlist-item.active .artist { color: var(--blue-primary); opacity: 0.7; }
        .duration { font-size: 0.8rem; color: var(--text-muted); }

        @media (max-width: 1024px) {
          .music-layout { grid-template-columns: 1fr; }
        }
        .w-full { width: 100%; }
        .mt-4 { margin-top: 1rem; }
      `}</style>
        </div>
    );
};

export default Wellness;
