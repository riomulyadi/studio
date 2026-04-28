"use client";

import { useState, useEffect } from 'react';
import { getCuisines, getMealTypes } from '@/lib/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RecipeFiltersProps {
  onFilterChange: (filters: { cuisine: string; mealType: string }) => void;
}

export function RecipeFilters({ onFilterChange }: RecipeFiltersProps) {
  const [cuisine, setCuisine] = useState('all');
  const [mealType, setMealType] = useState('all');

  const cuisines = getCuisines();
  const mealTypes = getMealTypes();

  useEffect(() => {
    onFilterChange({ cuisine, mealType });
  }, [cuisine, mealType, onFilterChange]);

  return (
    <div className="mb-8 flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <Select value={cuisine} onValueChange={setCuisine}>
          <SelectTrigger className="w-full h-12">
            <SelectValue placeholder="Filter by Cuisine" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cuisines</SelectItem>
            {cuisines.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1">
        <Select value={mealType} onValueChange={setMealType}>
          <SelectTrigger className="w-full h-12">
            <SelectValue placeholder="Filter by Meal Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Meal Types</SelectItem>
            {mealTypes.map(mt => <SelectItem key={mt} value={mt}>{mt}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
