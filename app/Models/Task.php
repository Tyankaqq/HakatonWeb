<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'parameters'
    ];

    public $timestamps = true;

    protected $casts = [
        'parameters' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function getParameter(string $key, mixed $default = null): mixed
    {
        return $this->parameters[$key] ?? $default;
    }

    public function setParameter(string $key, mixed $value): void
    {
        $parameters = $this->parameters ?? [];
        $parameters[$key] = $value;
        $this->parameters = $parameters;
        $this->save();
    }

    public function setParameters(array $parameters): void
    {
        $current = $this->parameters ?? [];
        $this->parameters = array_merge($current, $parameters);
        $this->save();
    }

    public function removeParameter(string $key): void
    {
        $parameters = $this->parameters ?? [];
        unset($parameters[$key]);
        $this->parameters = $parameters;
        $this->save();
    }

    public function hasParameter(string $key): bool
    {
        return isset($this->parameters[$key]);
    }

    public function scopeWhereParameter($query, string $key, mixed $value)
    {
        return $query->whereRaw("parameters @> ?", [json_encode([$key => $value])]);
    }

    public function scopeWhereParameters($query, array $parameters)
    {
        return $query->whereRaw("parameters @> ?", [json_encode($parameters)]);
    }

    public function scopeWhereHasParameter($query, string $key)
    {
        return $query->whereRaw("parameters ? ?", [$key]);
    }

    public function scopeWhereAnyParameter($query, array $parameters)
    {
        return $query->where(function ($q) use ($parameters) {
            foreach ($parameters as $key => $value) {
                $q->orWhereRaw("parameters @> ?", [json_encode([$key => $value])]);
            }
        });
    }

    public function scopeWhereParameterLike($query, string $key, string $value)
    {
        return $query->whereRaw("parameters->>? LIKE ?", [$key, "%{$value}%"]);
    }

    public function scopeWhereParameterBetween($query, string $key, int $min, int $max)
    {
        return $query->whereRaw(
            "(parameters->>?)::int BETWEEN ? AND ?",
            [$key, $min, $max]
        );
    }
}
