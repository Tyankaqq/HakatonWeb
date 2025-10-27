<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'middle_name',
        'status'
    ];

    protected $casts = [

    ];

    public $timestamps = false;

    public function flags(): BelongsToMany
    {
        return $this->belongsToMany(Flag::class)
            ->using(FlagUser::class)
            ->withPivot('value');
    }

    public function assignedTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'assigned_user_id');
    }

    public function getFlagValue(string $key): ?string
    {
        $flag = $this->flags()->where('key', $key)->first();
        return $flag?->value;
    }

    public function hasFlag(string $key, ?string $value = null): bool
    {
        $query = $this->flags()->where('key', $key);

        if ($value !== null) {
            $query->where('value', $value);
        }

        return $query->exists();
    }

    public function addFlag(int $flagId): void
    {
        $this->flags()->syncWithoutDetaching([$flagId]);
    }

    public function addFlagByKeyValue(string $key, string $value): void
    {
        $flag = Flag::where('key', $key)
            ->where('value', $value)
            ->where('is_active', true)
            ->firstOrFail();

        $this->flags()->syncWithoutDetaching([$flag->id]);
    }

    public function removeFlagsByKey(string $key): void
    {
        $flagIds = Flag::where('key', $key)->pluck('id');
        $this->flags()->detach($flagIds);
    }

    public function removeFlag(string $key, string $value): void
    {
        $flag = Flag::where('key', $key)->where('value', $value)->first();

        if ($flag) {
            $this->flags()->detach($flag->id);
        }
    }

    public function updateFlag(string $key, string $newValue): void
    {
        $this->removeFlagsByKey($key);
        $this->addFlagByKeyValue($key, $newValue);
    }

    public function getFlagsArray(): array
    {
        return $this->flags->pluck('value', 'key')->toArray();
    }

    public function setFlags(array $flags): void
    {
        foreach ($flags as $key => $value) {
            $this->updateFlag($key, $value);
        }
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeInactive($query)
    {
        return $query->where('status', 'inactive');
    }

    public function scopeWithFlag($query, string $key, string $value)
    {
        return $query->whereHas('flags', function ($q) use ($key, $value) {
            $q->where('key', $key)->where('value', $value);
        });
    }

    public function scopeWithFlagKey($query, string $key)
    {
        return $query->whereHas('flags', function ($q) use ($key) {
            $q->where('key', $key);
        });
    }


    public function scopeActiveWithFlag($query, string $key, string $value)
    {
        return $query->where('status', 'active')
            ->withFlag($key, $value);
    }

    public function scopeWithAllFlags($query, array $flags)
    {
        foreach ($flags as $key => $value) {
            $query->withFlag($key, $value);
        }

        return $query;
    }

    public function scopeWithAnyFlag($query, array $flags)
    {
        return $query->where(function ($q) use ($flags) {
            foreach ($flags as $key => $value) {
                $q->orWhereHas('flags', function ($subQ) use ($key, $value) {
                    $subQ->where('key', $key)->where('value', $value);
                });
            }
        });
    }

    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->middle_name} {$this->last_name}");
    }

    public function getActiveTasksCountAttribute(): int
    {
        return $this->assignedTasks()
            ->whereIn('status', ['assigned', 'processing'])
            ->count();
    }

    public function canTakeMoreTasks(): bool
    {
        $maxTasks = (int) ($this->getFlagValue('max_tasks') ?? 10);
        $currentTasks = $this->active_tasks_count;

        return $currentTasks < $maxTasks;
    }
}
