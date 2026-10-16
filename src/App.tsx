/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FlaskConical,
  RefreshCw,
  Plus,
  AlertCircle
} from 'lucide-react';

type IonType = 'H+' | 'Cl-';

interface StepRecord {
  stepId: number;
  addedIon: IonType;
  ohLeft: number;
  waterCreated: number;
  hLeft: number;
  clLeft: number;
  status: '산성' | '중성' | '염기성';
}

export default function App() {
  const initialOhCount = 6;
  const maxIonsLimit = 50;

  const [ionsAdded, setIonsAdded] = useState<IonType[]>([]);
  const [selectedIon, setSelectedIon] = useState<IonType>('H+');
  const [history, setHistory] = useState<StepRecord[]>([]);

  const hAddedCount = ionsAdded.filter((i) => i === 'H+').length;
  const clAddedCount = ionsAdded.filter((i) => i === 'Cl-').length;

  const waterCreated = Math.min(initialOhCount, hAddedCount);
  const ohLeft = Math.max(0, initialOhCount - hAddedCount);
  const hLeft = Math.max(0, hAddedCount - initialOhCount);
  const clLeft = clAddedCount;

  let status: '산성' | '중성' | '염기성' = '염기성';
  if (hLeft > 0) status = '산성';
  else if (ohLeft === 0 && hLeft === 0) status = '중성';
  else status = '염기성';

  const handleAddIon = () => {
    if (ionsAdded.length >= maxIonsLimit) return;
    const newIons = [...ionsAdded, selectedIon];
    setIonsAdded(newIons);

    const newOhLeft = Math.max(0, initialOhCount - newIons.filter(i => i === 'H+').length);
    const newWater = Math.min(initialOhCount, newIons.filter(i => i === 'H+').length);
    const newHLeft = Math.max(0, newIons.filter(i => i === 'H+').length - initialOhCount);
    const newClLeft = newIons.filter(i => i === 'Cl-').length;

    let newStatus: '산성' | '중성' | '염기성' = '염기성';
    if (newHLeft > 0) newStatus = '산성';
    else if (newOhLeft === 0 && newHLeft === 0) newStatus = '중성';

    const newStep: StepRecord = {
      stepId: history.length + 1,
      addedIon: selectedIon,
      ohLeft: newOhLeft,
      waterCreated: newWater,
      hLeft: newHLeft,
      clLeft: newClLeft,
      status: newStatus,
    };

    setHistory((prev) => [...prev, newStep]);
  };

  const handleReset = () => {
    setIonsAdded([]);
    setHistory([]);
  };

  // Compile all current particles to display in a neat fixed grid (stationary, no movement)
  const particles: Array<{ id: string; label: string; color: string }> = [];
  for (let i = 0; i < ohLeft; i++) particles.push({ id: `oh-${i}`, label: 'OH⁻', color: 'bg-orange-500' });
  for (let i = 0; i < 6; i++) particles.push({ id: `na-${i}`, label: 'Na⁺', color: 'bg-slate-500' });
  for (let i = 0; i < hLeft; i++) particles.push({ id: `h-${i}`, label: 'H⁺', color: 'bg-rose-500' });
  for (let i = 0; i < clLeft; i++) particles.push({ id: `cl-${i}`, label: 'Cl⁻', color: 'bg-blue-500' });
  for (let i = 0; i < waterCreated; i++) particles.push({ id: `h2o-${i}`, label: 'H₂O', color: 'bg-cyan-500' });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-indigo-400 tracking-wider uppercase">INTERACTIVE CHEMISTRY LAB · 01</span>
          <h1 className="text-xl font-black text-slate-100 mt-0.5">중화반응 실험실</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs px-3 py-1 bg-slate-800 text-slate-300 rounded-full border border-slate-700 font-medium">
            개념 모형 · 최대 50개 제한
          </span>
        </div>
      </header>

      <div className="bg-slate-900/60 border-b border-slate-800/80 px-6 py-2.5 text-xs text-slate-300">
        수산화나트륨 용액의 OH⁻에 염산에서 나온 이온을 하나씩 넣어 보세요. H⁺와 Cl⁻ 중 무엇이 실제로 OH⁻와 반응하는지 정렬된 입자 모형으로 확인합니다.
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Reaction Solution & Stationary Grid Beaker */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-slate-200">반응 용액 (입자 고정 배열)</h2>
              <span className="text-[11px] text-slate-400 font-mono">총 입자: {particles.length}개</span>
            </div>

            <div className="flex flex-col items-center my-3">
              <div className="text-[11px] text-slate-400 mb-1">염기 용액 · 시작 입자</div>
              <div className="w-4 h-5 bg-slate-700/60 rounded-t flex items-center justify-center">↓</div>

              {/* Beaker Container with Stationary Grid */}
              <div className={`relative w-80 h-72 border-x-4 border-b-4 border-slate-600 rounded-b-2xl overflow-hidden shadow-inner flex flex-col items-center justify-end p-4 transition-colors duration-300 ${
                status === '산성' ? 'bg-rose-950/20' : status === '염기성' ? 'bg-orange-950/20' : 'bg-emerald-950/20'
              }`}>
                {/* Fixed Grid Container */}
                <div className="w-full h-full flex flex-wrap content-start gap-2.5 p-2 overflow-y-auto">
                  {particles.map((p) => (
                    <div
                      key={p.id}
                      className={`w-11 h-11 rounded-full ${p.color} text-white font-bold text-xs flex items-center justify-center shadow-md border-2 border-white/80 transition-transform`}
                    >
                      {p.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-slate-400 mb-4">H⁺ 또는 Cl⁻를 골라 추가하세요. (최대 {maxIonsLimit}개)</p>

            <div className="grid grid-cols-5 gap-2 text-center text-xs font-medium">
              <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">남은 OH⁻</span>
                <span className="text-sm font-bold text-orange-400 font-mono">{ohLeft}개</span>
              </div>
              <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">생성 H₂O</span>
                <span className="text-sm font-bold text-cyan-400 font-mono">{waterCreated}개</span>
              </div>
              <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">남은 H⁺</span>
                <span className="text-sm font-bold text-rose-400 font-mono">{hLeft}개</span>
              </div>
              <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">용액에 남은 Cl⁻</span>
                <span className="text-sm font-bold text-blue-400 font-mono">{clLeft}개</span>
              </div>
              <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">상태</span>
                <span className={`text-xs font-bold ${
                  status === '산성' ? 'text-rose-400' : status === '염기성' ? 'text-orange-400' : 'text-emerald-400'
                }`}>
                  {status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Top = Controls, Bottom = Graphs (NO TABLE) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-200">이온을 골라 넣기</h2>
              <span className={`text-xs font-mono font-bold ${ionsAdded.length >= maxIonsLimit ? 'text-rose-400' : 'text-slate-400'}`}>
                추가된 횟수: {ionsAdded.length} / {maxIonsLimit}개
              </span>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-center space-y-1">
              <div className="text-base font-black text-indigo-300 font-mono">H⁺ + OH⁻ → H₂O</div>
              <p className="text-[11px] text-slate-400">순이온 반응식 · Cl⁻는 반응에 직접 참여하지 않는 구경꾼 이온</p>
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-2">넣을 이온 선택</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedIon('H+')}
                  className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    selectedIon === 'H+'
                      ? 'bg-rose-950/50 border-rose-500 shadow-md ring-1 ring-rose-500'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-rose-400 text-base">H⁺</span>
                    <input type="radio" checked={selectedIon === 'H+'} readOnly className="accent-rose-500" />
                  </div>
                  <span className="text-[11px] text-slate-300">OH⁻ 하나와 반응해 물 생성</span>
                </button>

                <button
                  onClick={() => setSelectedIon('Cl-')}
                  className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    selectedIon === 'Cl-'
                      ? 'bg-blue-950/50 border-blue-500 shadow-md ring-1 ring-blue-500'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-blue-400 text-base">Cl⁻</span>
                    <input type="radio" checked={selectedIon === 'Cl-'} readOnly className="accent-blue-500" />
                  </div>
                  <span className="text-[11px] text-slate-300">반응하지 않고 용액에 남음</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleAddIon}
                disabled={ionsAdded.length >= maxIonsLimit}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-bold text-xs shadow-lg transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                {ionsAdded.length >= maxIonsLimit ? '최대 50개 도달 완료' : '+ 선택한 이온 넣기'}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium text-xs border border-slate-700 transition flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                초기화
              </button>
            </div>

            {ionsAdded.length >= maxIonsLimit && (
              <div className="flex items-center gap-2 bg-rose-950/60 border border-rose-800/60 p-3 rounded-xl text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                최대 제한인 50개에 도달했습니다. 초기화 후 다시 실험해 보세요.
              </div>
            )}
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-200">변화 그래프</h2>
              <span className="text-[11px] text-slate-400">이온 추가 횟수에 따라 그려짐</span>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-orange-400">남은 OH⁻</span>
                  <span className="text-[10px] text-slate-500">최고 6</span>
                </div>
                <div className="h-10 bg-slate-900 rounded-lg flex items-end px-2 pb-1 gap-1 overflow-hidden">
                  {history.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600">이온을 넣으면 그래프가 그려집니다</div>
                  ) : (
                    history.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex-1 bg-orange-500 rounded-t transition-all"
                        style={{ height: `${(step.ohLeft / initialOhCount) * 100}%` }}
                        title={`단계 ${step.stepId}: ${step.ohLeft}개`}
                      ></div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-cyan-400">생성한 H₂O</span>
                  <span className="text-[10px] text-slate-500">최고 6</span>
                </div>
                <div className="h-10 bg-slate-900 rounded-lg flex items-end px-2 pb-1 gap-1 overflow-hidden">
                  {history.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600">이온을 넣으면 그래프가 그려집니다</div>
                  ) : (
                    history.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex-1 bg-cyan-500 rounded-t transition-all"
                        style={{ height: `${(step.waterCreated / initialOhCount) * 100}%` }}
                        title={`단계 ${step.stepId}: ${step.waterCreated}개`}
                      ></div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-blue-400">용액에 남은 Cl⁻</span>
                  <span className="text-[10px] text-slate-500">최고 50</span>
                </div>
                <div className="h-10 bg-slate-900 rounded-lg flex items-end px-2 pb-1 gap-1 overflow-hidden">
                  {history.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600">이온을 넣으면 그래프가 그려집니다</div>
                  ) : (
                    history.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex-1 bg-blue-500 rounded-t transition-all"
                        style={{ height: `${Math.min(100, (step.clLeft / maxIonsLimit) * 100)}%` }}
                        title={`단계 ${step.stepId}: ${step.clLeft}개`}
                      ></div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
