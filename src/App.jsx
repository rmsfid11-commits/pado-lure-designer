import { useState, useRef, useEffect } from 'react';
import { generateFromText, generateFromImage } from './api/gemini';
import './App.css';

const LURE_MODES = [
  { id: 'rendering', label: '렌더링', desc: '제품 사진 스타일' },
  { id: 'blueprint', label: '설계도', desc: '4면도 + 규격' },
  { id: 'product', label: '제품 이미지', desc: '흰 배경 제품샷' },
  { id: 'threeD', label: '3D 뷰', desc: '대각 + 측면 2장' },
  { id: 'underwater', label: '수중 액션', desc: '물속 액션 장면' },
  { id: 'package', label: '패키지', desc: '블리스터 포장' },
  { id: 'colorVariants', label: '컬러 변형', desc: '색상 4종 비교' },
  { id: 'logo', label: '로고 각인', desc: '브랜드 클로즈업' },
];

const LURE_TYPES = [
  { id: 'minnow', label: '미노우' },
  { id: 'crank', label: '크랭크' },
  { id: 'spoon', label: '스푼' },
  { id: 'jig', label: '지그' },
  { id: 'vibration', label: '바이브레이션' },
  { id: 'popper', label: '포퍼' },
  { id: 'pencil', label: '펜슬베이트' },
  { id: 'shad', label: '섀드' },
];

const COLORS = [
  { id: 'red', label: '빨강', hex: '#ef4444' },
  { id: 'blue', label: '파랑', hex: '#3b82f6' },
  { id: 'green', label: '초록', hex: '#22c55e' },
  { id: 'gold', label: '금색', hex: '#eab308' },
  { id: 'silver', label: '은색', hex: '#94a3b8' },
  { id: 'orange', label: '주황', hex: '#f97316' },
  { id: 'pink', label: '핑크', hex: '#ec4899' },
  { id: 'black', label: '블랙', hex: '#1e1e1e' },
  { id: 'white', label: '화이트', hex: '#f5f5f5' },
  { id: 'holo', label: '홀로그램', hex: 'linear-gradient(135deg,#f97,#3bf,#3b6,#fb3)' },
];

function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [gallery, setGallery] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pado-gallery') || '[]');
    } catch { return []; }
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [activeTab, setActiveTab] = useState('lure');
  const [viewImage, setViewImage] = useState(null);
  const [mode, setMode] = useState('rendering');
  const [selectedType, setSelectedType] = useState('');
  const [selectedColors, setSelectedColors] = useState([]);
  const [lureSize, setLureSize] = useState(7);
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('pado-gallery', JSON.stringify(gallery));
    } catch { /* 용량 초과 시 무시 */ }
  }, [gallery]);

  // 프리셋 선택 시 프롬프트 자동 조합
  const buildPrompt = () => {
    const parts = [];
    if (lureSize) parts.push(`${lureSize}cm`);
    if (selectedType) {
      const t = LURE_TYPES.find((t) => t.id === selectedType);
      if (t) parts.push(t.label);
    }
    if (selectedColors.length > 0) {
      const colorNames = selectedColors.map((c) => COLORS.find((cl) => cl.id === c)?.label).filter(Boolean);
      parts.push(colorNames.join(' + ') + ' 컬러');
    }
    if (prompt.trim()) parts.push(prompt.trim());
    return parts.join(', ');
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
  };

  const handleGenerate = async () => {
    const finalPrompt = activeTab === 'lure' ? buildPrompt() : prompt;
    if (!finalPrompt.trim() && !imageFile) return;
    setLoading(true);
    setResult(null);
    const currentMode = activeTab === 'free' ? 'free' : mode;
    try {
      let res;
      if (imageFile) {
        const base64 = await fileToBase64(imageFile);
        res = await generateFromImage(base64, imageFile.type, finalPrompt, currentMode);
      } else {
        res = await generateFromText(finalPrompt, currentMode);
      }
      setResult(res);
    } catch (err) {
      console.error(err);
      alert('생성 실패: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 재생성 (같은 설정으로 다시)
  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleSave = () => {
    if (!result?.imageData) return;
    const currentMode = activeTab === 'free' ? 'free' : mode;
    const finalPrompt = activeTab === 'lure' ? buildPrompt() : prompt;
    setGallery((prev) => [
      {
        id: Date.now(),
        imageData: result.imageData,
        prompt: finalPrompt,
        mode: currentMode,
        createdAt: new Date().toLocaleString('ko-KR'),
      },
      ...prev,
    ]);
  };

  const handleDownload = (imageData, name) => {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = `pado-lure-${name || Date.now()}.png`;
    link.click();
  };

  const handleClear = () => {
    setPrompt('');
    setPreviewImage(null);
    setImageFile(null);
    setResult(null);
    setSelectedType('');
    setSelectedColors([]);
    setLureSize(7);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleColor = (colorId) => {
    setSelectedColors((prev) =>
      prev.includes(colorId) ? prev.filter((c) => c !== colorId) : [...prev, colorId]
    );
  };

  const isLureTab = activeTab === 'lure';
  const isFreeTab = activeTab === 'free';
  const isGalleryTab = activeTab === 'gallery';

  return (
    <div className="app">
      <header className="header">
        <h1>송근량 전용 디자인 웹</h1>
        <p>AI로 나만의 디자인을 만들어보세요</p>
      </header>

      <nav className="tabs">
        <button className={isLureTab ? 'active' : ''} onClick={() => setActiveTab('lure')}>
          루어 디자인
        </button>
        <button className={isFreeTab ? 'active' : ''} onClick={() => setActiveTab('free')}>
          자유 생성
        </button>
        <button className={isGalleryTab ? 'active' : ''} onClick={() => setActiveTab('gallery')}>
          갤러리 ({gallery.length})
        </button>
      </nav>

      {(isLureTab || isFreeTab) && (
        <main className="main">
          <div className="input-section">
            {/* 루어 모드 선택 */}
            {isLureTab && (
              <>
                <div className="mode-selector">
                  {LURE_MODES.map((m) => (
                    <button
                      key={m.id}
                      className={`mode-btn ${mode === m.id ? 'active' : ''}`}
                      onClick={() => setMode(m.id)}
                    >
                      <span className="mode-label">{m.label}</span>
                      <span className="mode-desc">{m.desc}</span>
                    </button>
                  ))}
                </div>

                {/* 루어 타입 프리셋 */}
                <div className="input-group">
                  <label>루어 타입</label>
                  <div className="preset-row">
                    {LURE_TYPES.map((t) => (
                      <button
                        key={t.id}
                        className={`preset-btn ${selectedType === t.id ? 'active' : ''}`}
                        onClick={() => setSelectedType(selectedType === t.id ? '' : t.id)}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 색상 팔레트 */}
                <div className="input-group">
                  <label>컬러 (복수 선택 가능)</label>
                  <div className="color-row">
                    {COLORS.map((c) => (
                      <button
                        key={c.id}
                        className={`color-btn ${selectedColors.includes(c.id) ? 'active' : ''}`}
                        style={{
                          background: c.hex.startsWith('linear') ? c.hex : c.hex,
                        }}
                        onClick={() => toggleColor(c.id)}
                        title={c.label}
                      />
                    ))}
                  </div>
                  {selectedColors.length > 0 && (
                    <p className="color-selected">
                      {selectedColors.map((c) => COLORS.find((cl) => cl.id === c)?.label).join(', ')}
                    </p>
                  )}
                </div>

                {/* 크기 슬라이더 */}
                <div className="input-group">
                  <label>크기: {lureSize}cm</label>
                  <input
                    type="range"
                    min="3"
                    max="20"
                    value={lureSize}
                    onChange={(e) => setLureSize(Number(e.target.value))}
                    className="size-slider"
                  />
                  <div className="size-labels">
                    <span>3cm</span>
                    <span>20cm</span>
                  </div>
                </div>
              </>
            )}

            <div className="input-group">
              <label>{isLureTab ? '추가 설명 (선택)' : '이미지 설명'}</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  isLureTab
                    ? '예: 리얼한 눈알, 트레블 훅 2개, 홀로그램 비늘 패턴'
                    : '예: 석양이 지는 바다 위 낚시배, 유화 스타일'
                }
                rows={3}
              />
            </div>

            {/* 조합 미리보기 */}
            {isLureTab && buildPrompt() && (
              <div className="prompt-preview">
                <span>조합:</span> {buildPrompt()}
              </div>
            )}

            <div className="input-group">
              <label>참고 이미지 (스케치/사진)</label>
              <div
                className="upload-area"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewImage ? (
                  <img src={previewImage} alt="미리보기" className="preview-img" />
                ) : (
                  <div className="upload-placeholder">
                    <span className="upload-icon">+</span>
                    <p>클릭해서 이미지 업로드</p>
                    <p className="sub">스케치, 사진, 참고 이미지</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  hidden
                />
              </div>
            </div>

            <div className="actions">
              <button
                className="btn-generate"
                onClick={handleGenerate}
                disabled={loading || (!buildPrompt().trim() && !prompt.trim() && !imageFile)}
              >
                {loading ? '생성 중...' : isLureTab ? '루어 디자인 생성' : '이미지 생성'}
              </button>
              <button className="btn-clear" onClick={handleClear}>
                초기화
              </button>
            </div>
          </div>

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>{isLureTab ? 'AI가 루어를 디자인하고 있어요...' : 'AI가 이미지를 생성하고 있어요...'}</p>
            </div>
          )}

          {result?.imageData && (
            <div className="result-section">
              <h2>생성 결과</h2>
              <div className="result-image-wrap">
                <img
                  src={result.imageData}
                  alt="생성된 이미지"
                  className="result-image"
                  onClick={() => setViewImage(result.imageData)}
                />
              </div>
              {result.text && <p className="result-text">{result.text}</p>}
              <div className="result-actions">
                <button onClick={handleSave}>갤러리에 저장</button>
                <button onClick={() => handleDownload(result.imageData)}>다운로드</button>
                <button className="btn-regen" onClick={handleRegenerate} disabled={loading}>
                  재생성
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {isGalleryTab && (
        <main className="gallery">
          {gallery.length === 0 ? (
            <div className="empty">
              <p>아직 저장된 디자인이 없어요</p>
              <p className="sub">디자인을 생성하고 저장해보세요!</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {gallery.map((item) => (
                <div key={item.id} className="gallery-item">
                  <img
                    src={item.imageData}
                    alt="디자인"
                    onClick={() => setViewImage(item.imageData)}
                  />
                  <div className="gallery-info">
                    <p className="gallery-prompt">{item.prompt || '(설명 없음)'}</p>
                    <span className="gallery-mode">{item.mode}</span>
                    <p className="gallery-date">{item.createdAt}</p>
                    <div className="gallery-actions">
                      <button onClick={() => handleDownload(item.imageData, item.id)}>저장</button>
                      <button
                        className="btn-delete"
                        onClick={() =>
                          setGallery((prev) => prev.filter((g) => g.id !== item.id))
                        }
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {viewImage && (
        <div className="modal" onClick={() => setViewImage(null)}>
          <img src={viewImage} alt="확대" />
        </div>
      )}
    </div>
  );
}

export default App;
