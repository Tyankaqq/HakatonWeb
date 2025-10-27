<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FlagUser extends Model
{
    protected $table = 'flag_user';

    protected $fillable = [
        'user_id',
        'flag_id',
        'value'
    ];

    public $timestamps = false;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function flag(): BelongsTo
    {
        return $this->belongsTo(Flag::class);
    }

    public function getFullDescriptionAttribute(): string
    {
        return "{$this->flag->key} = {$this->value}";
    }
}
