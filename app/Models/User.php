<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'first_name',
        'last_name',
        'middle_name',
        'status',
        'daily_limit',
        'weight',
    ];

    protected $casts = [
        'status' => 'boolean',
        'daily_limit' => 'integer',
        'weight' => 'integer',
    ];

    public function parameters(): BelongsToMany
    {
        return $this->belongsToMany(Parameter::class, 'parameter_user')
            ->withPivot('value', 'comparison_operator')
            ->using(ParameterUser::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function getOpenTasksCount(): int
    {
        return $this->tasks()
            ->whereNotNull('user_id')
            ->count();
    }

    public function getTodayTasksCount(): int
    {
        return $this->tasks()
            ->whereDate('created_at', today())
            ->count();
    }

    public function hasReachedDailyLimit(): bool
    {
        if (!$this->daily_limit) {
            return false;
        }

        return $this->getTodayTasksCount() >= $this->daily_limit;
    }
}
