'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════════════════════════════
 * SearchBar — Liquid Knowledge Design System
 *
 * A premium search input with icon, clear button, optional
 * suggestions dropdown, and loading state.
 * ═══════════════════════════════════════════════════════════════ */

export interface SearchSuggestion {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface SearchBarProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elevated' | 'navy';
  className?: string;
}

export function SearchBar({
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  onSubmit,
  placeholder = 'Search books, journals, resources...',
  suggestions = [],
  onSuggestionSelect,
  isLoading = false,
  size = 'md',
  variant = 'default',
  className,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const value = controlledValue ?? internalValue;

  const updateValue = useCallback(
    (newValue: string) => {
      if (!controlledValue) setInternalValue(newValue);
      onValueChange?.(newValue);
    },
    [controlledValue, onValueChange]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        onSuggestionSelect?.(suggestions[activeIndex]);
        updateValue(suggestions[activeIndex].label);
        setShowSuggestions(false);
      } else if (value.trim()) {
        onSubmit?.(value.trim());
      }
    },
    [value, activeIndex, suggestions, onSuggestionSelect, onSubmit, updateValue]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showSuggestions || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1));
          break;
        case 'Escape':
          setShowSuggestions(false);
          inputRef.current?.blur();
          break;
      }
    },
    [showSuggestions, suggestions.length]
  );

  useEffect(() => {
    setActiveIndex(-1);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const shouldShowSuggestions = showSuggestions && suggestions.length > 0 && value.trim().length > 0;

  const sizeClasses = {
    sm: 'h-9 pl-9 pr-8 text-sm rounded-lg',
    md: 'h-11 pl-11 pr-10 text-sm rounded-xl',
    lg: 'h-13 pl-12 pr-12 text-base rounded-2xl',
  };

  const iconSizeClasses = {
    sm: 'size-4 left-3',
    md: 'size-[18px] left-3.5',
    lg: 'size-5 left-4',
  };

  const clearSizeClasses = {
    sm: 'size-4 right-2.5',
    md: 'size-4 right-3',
    lg: 'size-5 right-4',
  };

  const variantClasses = {
    default: 'bg-surface border-border shadow-sm focus-within:shadow-md focus-within:border-ring/40',
    elevated: 'bg-surface border-0 shadow-md focus-within:shadow-lg',
    navy: 'bg-navy/5 border-navy/10 shadow-sm focus-within:shadow-md focus-within:border-navy/30 dark:bg-navy/20',
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <form onSubmit={handleSubmit}>
        <div
          className={cn(
            'flex items-center transition-all duration-200',
            sizeClasses[size],
            variantClasses[variant],
            isFocused && 'ring-2 ring-ring/20'
          )}
        >
          <Search
            className={cn(
              'absolute text-muted-foreground pointer-events-none transition-colors',
              iconSizeClasses[size],
              isFocused && 'text-primary'
            )}
          />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => {
              updateValue(e.target.value);
              if (!showSuggestions) setShowSuggestions(true);
            }}
            onFocus={() => {
              setIsFocused(true);
              if (value.trim()) setShowSuggestions(true);
            }}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn(
              'flex-1 bg-transparent outline-none placeholder:text-muted-foreground'
            )}
            role="combobox"
            aria-expanded={shouldShowSuggestions}
            aria-autocomplete="list"
            aria-activedescendant={
              activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined
            }
          />
          {isLoading ? (
            <Loader2
              className={cn('absolute animate-spin text-muted-foreground', clearSizeClasses[size])}
            />
          ) : value ? (
            <button
              type="button"
              onClick={() => {
                updateValue('');
                inputRef.current?.focus();
              }}
              className={cn(
                'absolute flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors',
                clearSizeClasses[size]
              )}
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>
      </form>

      {/* Suggestions dropdown */}
      {shouldShowSuggestions && (
        <div
          className={cn(
            'absolute top-full left-0 right-0 z-50 mt-1.5',
            'bg-surface rounded-xl border border-border shadow-elevated',
            'py-1.5 overflow-hidden'
          )}
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              id={`suggestion-${index}`}
              type="button"
              role="option"
              aria-selected={index === activeIndex}
              onClick={() => {
                onSuggestionSelect?.(suggestion);
                updateValue(suggestion.label);
                setShowSuggestions(false);
                onSubmit?.(suggestion.label);
              }}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                index === activeIndex
                  ? 'bg-primary/5 text-foreground'
                  : 'text-foreground hover:bg-muted/60'
              )}
            >
              {suggestion.icon && (
                <span className="text-muted-foreground shrink-0">{suggestion.icon}</span>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{suggestion.label}</div>
                {suggestion.description && (
                  <div className="text-xs text-muted-foreground truncate">
                    {suggestion.description}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
