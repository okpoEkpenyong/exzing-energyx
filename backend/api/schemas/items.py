# backend\api\schemas\items.py

from pydantic import BaseModel


class Item(BaseModel):
    id: int
    name: str
    description: str | None = None
    price: float


class ItemOut(Item):
    pass