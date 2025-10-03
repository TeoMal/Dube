import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Video from "../public/q1_video.mp4";
import Sound from "../public/q1_sound.mp3";

export default function AddChapter() {
  const [chapterName, setChapterName] = useState("");
  const [chapterDescription, setChapterDescription] = useState("");
  const [pages, setPages] = useState([]);
  const [showChapterModal, setShowChapterModal] = useState(true);
  const [showTextModal, setShowTextModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false); // New question modal
  const [currentPageId, setCurrentPageId] = useState(null);
  const [textInput, setTextInput] = useState("");
  
  // Question modal states
  const [questionText, setQuestionText] = useState("");
  const [choices, setChoices] = useState({ a: "", b: "", c: "", d: "" });
  const [correctChoice, setCorrectChoice] = useState("a");

  const handleSaveChapterInfo = () => {
    if (!chapterName.trim()) { alert("Please enter a chapter name."); return; }
    setShowChapterModal(false);
    setPages([{ id: 1, type: null, content: { text: "", video: null, audio: null }, questions: [], test: null }]);
  };

  const addPage = () => {
    setPages(prev => [...prev, { id: prev.length + 1, type: null, content: { text: "", video: null, audio: null }, questions: [], test: null }]);
  };

  const removePage = (pageId) => setPages(prev => prev.filter(p => p.id !== pageId));
  const setPageType = (pageId, type) => setPages(prev => prev.map(p => (p.id === pageId ? { ...p, type } : p)));

  const openTextModal = (pageId) => {
    const page = pages.find(p => p.id === pageId);
    setTextInput(page.content.text || "");
    setCurrentPageId(pageId);
    setShowTextModal(true);
  };

  const saveTextContent = () => {
    setPages(prev => prev.map(p =>
      p.id === currentPageId
        ? { ...p, content: { ...p.content, text: textInput, video: 'something', audio: 'something' } }
        : p
    ));
    setShowTextModal(false);
    setCurrentPageId(null);
    setTextInput("");
  };

  // ---- Question modal ----
  const openQuestionModal = (pageId) => {
    setCurrentPageId(pageId);
    setQuestionText("");
    setChoices({ a: "", b: "", c: "", d: "" });
    setCorrectChoice("a");
    setShowQuestionModal(true);
  };

  const saveQuestion = () => {
    if (!questionText.trim()) { alert("Please enter the question."); return; }
    const pageIndex = pages.findIndex(p => p.id === currentPageId);
    const newQuestion = { question: questionText, choices, correct: correctChoice };
    const updatedPages = [...pages];
    updatedPages[pageIndex].questions = [...(updatedPages[pageIndex].questions || []), newQuestion];
    setPages(updatedPages);
    setShowQuestionModal(false);
    setCurrentPageId(null);
  };

  const finalizeChapter = () => {
    const course = "PHYSICS"; // Replace with actual course key or prop
    fetch("http://127.0.0.1:5000/add_chapter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course, chapter: { name: chapterName, description: chapterDescription, pages } })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") alert(`Chapter added successfully! Key: ${data.chapter_key}`);
        else alert("Error adding chapter");
      })
      .catch(err => { console.error(err); alert("Error adding chapter"); });
  };

  return (
    <div className="container my-5">
      {/* Chapter modal */}
      {showChapterModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header"><h5 className="modal-title">New Chapter</h5></div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Chapter Name</label>
                  <input type="text" className="form-control" value={chapterName} onChange={(e) => setChapterName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" value={chapterDescription} onChange={(e) => setChapterDescription(e.target.value)}></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleSaveChapterInfo}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Text modal */}
      {showTextModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header"><h5 className="modal-title">Add Text Content</h5></div>
              <div className="modal-body">
                <textarea className="form-control" rows="5" value={textInput} onChange={(e) => setTextInput(e.target.value)}></textarea>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowTextModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={saveTextContent}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Question modal */}
      {showQuestionModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header"><h5 className="modal-title">Add Question</h5></div>
              <div className="modal-body">
                <div className="mb-3">
                  <label>Question</label>
                  <input type="text" className="form-control" value={questionText} onChange={e => setQuestionText(e.target.value)} />
                </div>
                <div className="mb-2">
                  <label>Choice A</label>
                  <input type="text" className="form-control" value={choices.a} onChange={e => setChoices({ ...choices, a: e.target.value })} />
                </div>
                <div className="mb-2">
                  <label>Choice B</label>
                  <input type="text" className="form-control" value={choices.b} onChange={e => setChoices({ ...choices, b: e.target.value })} />
                </div>
                <div className="mb-2">
                  <label>Choice C</label>
                  <input type="text" className="form-control" value={choices.c} onChange={e => setChoices({ ...choices, c: e.target.value })} />
                </div>
                <div className="mb-2">
                  <label>Choice D</label>
                  <input type="text" className="form-control" value={choices.d} onChange={e => setChoices({ ...choices, d: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label>Correct Choice</label>
                  <select className="form-select" value={correctChoice} onChange={e => setCorrectChoice(e.target.value)}>
                    <option value="a">A</option>
                    <option value="b">B</option>
                    <option value="c">C</option>
                    <option value="d">D</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowQuestionModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={saveQuestion}>Save Question</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!showChapterModal && (
        <>
          <h2 className="text-center mb-4">{chapterName}</h2>
          <p className="text-muted text-center mb-5">{chapterDescription}</p>

          {pages.map((page) => (
            <div key={page.id} className="card shadow mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5>Page {page.id}</h5>
                <div>
                  {!page.type && (
                    <>
                      <button className="btn btn-sm btn-primary me-2" onClick={() => setPageType(page.id, "content")}>Add Content</button>
                      <button className="btn btn-sm btn-success me-2" onClick={() => setPageType(page.id, "question")}>Add Question</button>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => setPageType(page.id, "test")}>Add Test</button>
                    </>
                  )}
                  <button className="btn btn-sm btn-danger" onClick={() => removePage(page.id)}>Remove Page</button>
                  {page.type === "question" && (
                    <button className="btn btn-sm btn-info ms-2" onClick={() => openQuestionModal(page.id)}>Add Question</button>
                  )}
                </div>
              </div>

              {page.type === "content" && (
                <div className="card-body d-flex flex-wrap gap-3">
                  <div className="card p-3 text-center flex-fill" style={{ minWidth: "150px" }}>
                    <button className="btn btn-outline-primary mb-2" onClick={() => openTextModal(page.id)}>Add Text</button>
                    {page.content.text && <p className="text-start bg-light p-2">{page.content.text}</p>}
                  </div>
                  <div className="card p-3 text-center flex-fill" style={{ minWidth: "150px" }}>
                    <button className="btn btn-outline-success mb-2" onClick={() => alert("Add Video functionality")}>Add Video</button>
                    {page.content.video && <video src={Video} controls className="w-100 mt-2" style={{ maxHeight: "200px" }} />}
                  </div>
                  <div className="card p-3 text-center flex-fill" style={{ minWidth: "150px" }}>
                    <button className="btn btn-outline-warning mb-2" onClick={() => alert("Add Audio functionality")}>Add Audio</button>
                    {page.content.audio && <audio src={Sound} controls className="w-100 mt-2" />}
                  </div>
                </div>
              )}

              {page.type === "question" && (
                <div className="card-body">
                  <p>Questions for Page {page.id}:</p>
                  {page.questions?.map((q, idx) => (
                    <div key={idx} className="mb-2 p-2 border rounded">
                      <strong>Q{idx + 1}:</strong> {q.question}<br />
                      <em>Choices:</em> A: {q.choices.a}, B: {q.choices.b}, C: {q.choices.c}, D: {q.choices.d}<br />
                      <strong>Correct:</strong> {q.correct.toUpperCase()}
                    </div>
                  ))}
                </div>
              )}

              {page.type === "test" && <div className="card-body"><p>Test editor placeholder for Page {page.id}</p></div>}
            </div>
          ))}

          <div className="text-center">
            <button className="btn btn-outline-primary" onClick={addPage}>+ Add Page</button>
          </div>
          <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-success" onClick={finalizeChapter}>Finalize Chapter</button>
          </div>
        </>
      )}
    </div>
  );
}
