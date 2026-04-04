'use client'

import { useState, useEffect, useRef } from 'react'

type Todo = {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('todos')
    if (saved) setTodos(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    setTodos(prev => [
      { id: crypto.randomUUID(), text: trimmed, completed: false, createdAt: Date.now() },
      ...prev,
    ])
    setInput('')
    inputRef.current?.focus()
  }

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'done') return t.completed
    return true
  })

  const activeCount = todos.filter(t => !t.completed).length

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-16">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-light tracking-widest text-stone-700 mb-1">TODO</h1>
        <p className="text-sm text-stone-400 tracking-wide">やることを整理しよう</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">

        {/* Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-stone-100">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTodo()}
            placeholder="タスクを入力..."
            className="flex-1 text-stone-700 placeholder-stone-300 bg-transparent outline-none text-sm"
          />
          <button
            onClick={addTodo}
            disabled={!input.trim()}
            className="w-8 h-8 rounded-full bg-stone-800 text-white flex items-center justify-center text-lg leading-none hover:bg-stone-600 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
            aria-label="タスクを追加"
          >
            +
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex border-b border-stone-100">
          {(['all', 'active', 'done'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2.5 text-xs tracking-wider transition-colors ${
                filter === f
                  ? 'text-stone-800 font-medium border-b-2 border-stone-800 -mb-px'
                  : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              {{ all: 'すべて', active: '未完了', done: '完了' }[f]}
            </button>
          ))}
        </div>

        {/* Todo list */}
        <ul className="divide-y divide-stone-50">
          {filtered.length === 0 && (
            <li className="py-12 text-center text-stone-300 text-sm">
              {filter === 'done' ? '完了したタスクはありません' : 'タスクがありません'}
            </li>
          )}
          {filtered.map(todo => (
            <li
              key={todo.id}
              className="flex items-center gap-4 px-5 py-4 group hover:bg-stone-50 transition-colors"
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleTodo(todo.id)}
                aria-label={todo.completed ? '未完了に戻す' : '完了にする'}
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  todo.completed
                    ? 'bg-emerald-400 border-emerald-400'
                    : 'border-stone-300 hover:border-stone-500'
                }`}
              >
                {todo.completed && (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>

              {/* Text */}
              <span
                className={`flex-1 text-sm leading-relaxed transition-colors ${
                  todo.completed ? 'text-stone-300 line-through' : 'text-stone-700'
                }`}
              >
                {todo.text}
              </span>

              {/* Delete */}
              <button
                onClick={() => deleteTodo(todo.id)}
                aria-label="削除"
                className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-full flex items-center justify-center text-stone-300 hover:text-red-400 hover:bg-red-50 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </li>
          ))}
        </ul>

        {/* Footer */}
        {todos.length > 0 && (
          <div className="px-5 py-3 border-t border-stone-50 flex items-center justify-between">
            <span className="text-xs text-stone-300">
              残り <span className="text-stone-500 font-medium">{activeCount}</span> 件
            </span>
            {todos.some(t => t.completed) && (
              <button
                onClick={() => setTodos(prev => prev.filter(t => !t.completed))}
                className="text-xs text-stone-300 hover:text-red-400 transition-colors"
              >
                完了済みを削除
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
