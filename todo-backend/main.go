package main

import (
	"log"
	"todo-backend/database"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"gorm.io/gorm"
)

type Product struct {
	ID    uint    `json:"id" gorm:"primaryKey"`
	Name  string  `json:"name"`
	Price float64 `json:"price"`
	Stock int     `json:"stock"`
}

var DB *gorm.DB

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	database.Connect()
	DB = database.DB

	DB.AutoMigrate(&Product{})

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	app.Get("/products", GetProducts)
	app.Post("/products", CreateProduct)
	app.Delete("/products/:id", DeleteProduct)

	app.Listen(":3000")
}

func GetProducts(c *fiber.Ctx) error {
	var products []Product
	DB.Find(&products)
	return c.JSON(products)
}

func CreateProduct(c *fiber.Ctx) error {
	product := new(Product)
	if err := c.BodyParser(product); err != nil {
		return c.Status(400).SendString(err.Error())
	}
	DB.Create(&product)
	return c.JSON(product)
}

func DeleteProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	var product Product
	DB.First(&product, id)
	if product.ID == 0 {
		return c.Status(404).SendString("No Product Found with ID")
	}
	DB.Delete(&product)
	return c.SendString("Product Successfully deleted")
}
