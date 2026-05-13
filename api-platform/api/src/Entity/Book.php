<?php
// api/src/Entity/Book.php
namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ApiResource(mercure: true)] // Enabling Mercure for real-time updates
class Book
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 20, unique: true)]
    #[Assert\NotBlank]
    #[Assert\Isbn]
    public string $isbn;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    public string $title;

    #[ORM\Column(type: 'text')]
    #[Assert\NotBlank]
    public string $description;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    public string $author;

    #[ORM\Column]
    #[Assert\NotNull]
    #[Assert\Type(\DateTimeImmutable::class)]
    public \DateTimeImmutable $publicationDate;

    /** @var Collection<int, Review> */
    #[ORM\OneToMany(mappedBy: 'book', targetEntity: Review::class, cascade: ['persist', 'remove'])]
    public Collection $reviews;

    public function __construct(
        string $isbn,
        string $title,
        string $description,
        string $author,
        \DateTimeImmutable $publicationDate
    ) {
        $this->isbn = $isbn;
        $this->title = $title;
        $this->description = $description;
        $this->author = $author;
        $this->publicationDate = $publicationDate;
        $this->reviews = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }
}