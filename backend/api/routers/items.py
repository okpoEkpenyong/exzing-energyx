# backend\api\routers\items.py


from fastapi import APIRouter
from backend.api.models.items import Item

router = APIRouter()

items_db = []

@router.post("/items")
def create_item(item: Item):
    items_db.append(item)
    return {"message": "Item created", "item": item}

@router.get("/items")
def get_items():
    return items_db
