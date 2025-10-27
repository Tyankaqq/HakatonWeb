<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Flag extends Model
{
    protected $fillable = [
        'key',
        'value',
        'name',
        'description',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->using(FlagUser::class)  // Используем кастомную pivot модель
            ->withPivot('value')
            ->withTimestamps();
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByKey($query, string $key)
    {
        return $query->where('key', $key);
    }

    public function scopeByValue($query, string $value)
    {
        return $query->where('value', $value);
    }

    public function getKeyValueAttribute(): string
    {
        return "{$this->key}={$this->value}";
    }

    public function getDisplayNameAttribute(): string
    {
        return $this->name ?? ucfirst($this->key) . ': ' . $this->value;
    }
}
