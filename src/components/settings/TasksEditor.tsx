import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { toHindiNumerals } from '../../lib/date';

export default function TasksEditor() {
  const tasks = useAppStore(state => state.tasks);
  const addTask = useAppStore(state => state.addTask);
  const removeTask = useAppStore(state => state.removeTask);
  const toggleTaskActive = useAppStore(state => state.toggleTaskActive);
  const updateTask = useAppStore(state => state.updateTask);
  const moveTaskUp = useAppStore(state => state.moveTaskUp);
  const moveTaskDown = useAppStore(state => state.moveTaskDown);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editIcon, setEditIcon] = useState('');
  const [editPoints, setEditPoints] = useState('');

  const [newTitle, setNewTitle] = useState('');
  const [newIcon, setNewIcon] = useState('⭐');
  const [newPoints, setNewPoints] = useState('1');

  const startEdit = (task: any) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditIcon(task.icon);
    setEditPoints(task.points.toString());
  };

  const saveEdit = (id: string) => {
    const points = parseInt(editPoints, 10);
    if (!editTitle.trim() || !editIcon.trim() || isNaN(points) || points <= 0) {
      alert('بيانات غير صحيحة');
      return;
    }
    updateTask(id, { title: editTitle, icon: editIcon, points });
    setEditingId(null);
  };

  const handleAddNew = () => {
    const points = parseInt(newPoints, 10);
    if (!newTitle.trim() || !newIcon.trim() || isNaN(points) || points <= 0) {
      alert('الرجاء إدخال بيانات صحيحة');
      return;
    }
    addTask({ title: newTitle.trim(),
      icon: newIcon.trim(),
      points,
      active: true,
    });
    setNewTitle('');
    setNewIcon('⭐');
    setNewPoints('1');
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
      <h3 className="text-xl font-bold text-gray-800 mb-4">المهام</h3>
      
      <div className="flex flex-col gap-3 mb-6">
        {tasks.map((task, index) => (
          <div key={task.id} className="border border-gray-200 rounded-xl p-3 bg-gray-50 flex flex-col gap-2">
            {editingId === task.id ? (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    value={editIcon}
                    onChange={(e) => setEditIcon(e.target.value)}
                    className="w-16 border rounded-lg px-2 py-2 text-center text-xl"
                    placeholder="⭐"
                  />
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-2 text-lg"
                    placeholder="اسم المهمة"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={editPoints}
                    onChange={(e) => setEditPoints(e.target.value)}
                    className="w-24 border rounded-lg px-3 py-2 text-center text-lg"
                    dir="ltr"
                    min="1"
                  />
                  <button onClick={() => saveEdit(task.id)} className="flex-1 bg-green-500 text-white rounded-lg py-2 font-bold min-h-[48px]">حفظ</button>
                  <button onClick={() => setEditingId(null)} className="flex-1 bg-gray-400 text-white rounded-lg py-2 font-bold min-h-[48px]">إلغاء</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{task.icon}</span>
                  <div>
                    <div className="font-bold text-gray-800">{task.title}</div>
                    <div className="text-sm text-gray-500">{toHindiNumerals(task.points)} نقطة</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleTaskActive(task.id)} className={`w-12 h-6 rounded-full relative transition-colors ${task.active ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${task.active ? 'left-1' : 'right-1'}`} />
                  </button>
                  <button onClick={() => startEdit(task)} className="p-2 text-blue-500 min-h-[48px] text-xl">✏️</button>
                  <div className="flex flex-col">
                    <button onClick={() => moveTaskUp(task.id)} disabled={index === 0} className="p-1 disabled:opacity-30 text-gray-500">▲</button>
                    <button onClick={() => moveTaskDown(task.id)} disabled={index === tasks.length - 1} className="p-1 disabled:opacity-30 text-gray-500">▼</button>
                  </div>
                  <button onClick={() => { if(window.confirm('متأكد من الحذف؟')) removeTask(task.id); }} className="p-2 text-red-500 min-h-[48px] text-xl">❌</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <h4 className="font-bold text-gray-700 mb-3">إضافة مهمة جديدة</h4>
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              value={newIcon}
              onChange={(e) => setNewIcon(e.target.value)}
              className="w-16 border-2 border-amber-200 rounded-xl px-2 py-3 text-center text-xl focus:border-amber-500"
              placeholder="الرمز"
            />
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 border-2 border-amber-200 rounded-xl px-3 py-3 text-lg focus:border-amber-500"
              placeholder="اسم المهمة"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 font-bold">النقاط:</span>
            <input
              type="number"
              value={newPoints}
              onChange={(e) => setNewPoints(e.target.value)}
              className="flex-1 border-2 border-amber-200 rounded-xl px-3 py-3 text-center text-lg focus:border-amber-500"
              dir="ltr"
              min="1"
            />
          </div>
          <button onClick={handleAddNew} className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-3 text-lg font-bold min-h-[48px]">
            إضافة المهمة
          </button>
        </div>
      </div>
    </div>
  );
}
