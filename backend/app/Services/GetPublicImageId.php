<?php

namespace App\Services;

class GetPublicImageId
{
  public function getPublicImageId(?string $imageUrl)
  {
    if (!$imageUrl) {
      return null;
    }

    $parts = explode('products/', $imageUrl);

    // 2. Take the last part ('nnm4aubjnbmc0jsjxjiu.webp')
    $lastPart = end($parts);

    // 3. Remove the extension (.webp)
    $filename = pathinfo($lastPart, PATHINFO_FILENAME);

    // 4. Re-combine with the folder name
    $publicId = "products/" . $filename;

    return $publicId;
  }
}
