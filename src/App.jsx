import { useState, useRef } from 'react';
import { generateLureFromText, generateLureFromImage } from './api/gemini';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [activeTab, setActiveTab] = useState('create');
  const [viewImage, setViewImage] = useState(null);
  const fileInputRef = useRef(null);

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
    if (!prompt.trim() && !imageFile) return;
    setLoading(true);
    setResult(null);
    try {
      let res;
      if (imageFile) {
        const base64 = await fileToBase64(imageFile);
        res = await generateLureFromImage(base64, imageFile.type, prompt);
      } else {
        res = await generateLureFromText(prompt);
      }
      setResult(res);
    } catch (err) {
      console.error(err);
      alert('생성 실패: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!result?.imageData) return;
    setGallery((prev) => [
      {
        id: Date.now(),
        imageData: result.imageData,
        prompt,
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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="app">
      <header className="header">
        <h1>파도점 루어 디자이너</h1>
        <p>AI로 나만의 루어 디자인을 만들어보세요</p>
      </header>

      <nav className="tabs">
        <button
          className={activeTab === 'create' ? 'active' : ''}
          onClick={() => setActiveTab('create')}
        >
          디자인 생성
        </button>
        <button
          className={activeTab === 'gallery' ? 'active' : ''}
          onClick={() => setActiveTab('gallery')}
        >
          갤러리 ({gallery.length})
        </button>
      </nav>

      {activeTab === 'create' && (
        <main className="main">
          <div className="input-section">
            <div className="input-group">
              <label>루어 설명</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="예: 5cm 미노우, 빨간색 바디에 금색 홀로그램 패턴, 리얼한 눈알, 트레블 훅 2개"
                rows={4}
              />
            </div>

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
                disabled={loading || (!prompt.trim() && !imageFile)}
              >
                {loading ? '생성 중...' : '루어 디자인 생성'}
              </button>
              <button className="btn-clear" onClick={handleClear}>
                초기화
              </button>
            </div>
          </div>

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>AI가 루어를 디자인하고 있어요...</p>
            </div>
          )}

          {result?.imageData && (
            <div className="result-section">
              <h2>생성 결과</h2>
              <div className="result-image-wrap">
                <img
                  src={result.imageData}
                  alt="생성된 루어"
                  className="result-image"
                  onClick={() => setViewImage(result.imageData)}
                />
              </div>
              {result.text && <p className="result-text">{result.text}</p>}
              <div className="result-actions">
                <button onClick={handleSave}>갤러리에 저장</button>
                <button onClick={() => handleDownload(result.imageData)}>
                  다운로드
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {activeTab === 'gallery' && (
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
                    alt="루어 디자인"
                    onClick={() => setViewImage(item.imageData)}
                  />
                  <div className="gallery-info">
                    <p className="gallery-prompt">{item.prompt || '(설명 없음)'}</p>
                    <p className="gallery-date">{item.createdAt}</p>
                    <div className="gallery-actions">
                      <button onClick={() => handleDownload(item.imageData, item.id)}>
                        저장
                      </button>
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
