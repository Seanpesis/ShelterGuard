import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';

export default function ShelterFilters({ filters, onFilterChange, cities }) {
  const handleFilter = (key, value) => {
    onFilterChange(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>City</Label>
        <Select value={filters.city} onValueChange={(value) => handleFilter('city', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {cities.map(city => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Type</Label>
        <Select value={filters.type} onValueChange={(value) => handleFilter('type', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="private">Private</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="residential">Residential</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Accessibility</Label>
        <Select value={filters.accessibility} onValueChange={(value) => handleFilter('accessibility', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Any Accessibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            <SelectItem value="accessible">Wheelchair Accessible</SelectItem>
            <SelectItem value="not_accessible">Not Accessible</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}