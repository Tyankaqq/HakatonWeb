<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Parameter extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'key',
        'value_type',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'parameter_user')
            ->withPivot('value', 'comparison_operator')
            ->using(ParameterUser::class);
    }
}
