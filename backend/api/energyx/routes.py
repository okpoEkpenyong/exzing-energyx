from datetime import datetime
from http import HTTPStatus
from typing import List, Optional
from urllib.parse import urljoin

from beanie import PydanticObjectId
from fastapi import HTTPException, Response
from starlette.requests import Request

from .app import app
from .models import (CreateUpdateenergyxItem, CreateUpdateenergyxList, energyxItem,
                     energyxList, energyxState)


@app.get("/lists", response_model=List[energyxList], response_model_by_alias=False)
async def get_lists(
    top: Optional[int] = None, skip: Optional[int] = None
) -> List[energyxList]:
    """
    Get all energyx lists

    Optional arguments:

    - **top**: Number of lists to return
    - **skip**: Number of lists to skip
    """
    query = energyxList.all().skip(skip).limit(top)
    return await query.to_list()


@app.post("/lists", response_model=energyxList, response_model_by_alias=False, status_code=201)
async def create_list(body: CreateUpdateenergyxList, request: Request, response: Response) -> energyxList:
    """
    Create a new energyx list
    """
    energyx_list = await energyxList(**body.dict(), createdDate=datetime.utcnow()).save()
    response.headers["Location"] = urljoin(str(request.base_url), "lists/{0}".format(str(energyx_list.id)))
    return energyx_list


@app.get("/lists/{list_id}", response_model=energyxList, response_model_by_alias=False)
async def get_list(list_id: PydanticObjectId) -> energyxList:
    """
    Get energyx list by ID
    """
    energyx_list = await energyxList.get(document_id=list_id)
    if not energyx_list:
        raise HTTPException(status_code=404, detail="energyx list not found")
    return energyx_list


@app.put("/lists/{list_id}", response_model=energyxList, response_model_by_alias=False)
async def update_list(
    list_id: PydanticObjectId, body: CreateUpdateenergyxList
) -> energyxList:
    """
    Updates a energyx list by unique identifier
    """
    energyx_list = await energyxList.get(document_id=list_id)
    if not energyx_list:
        raise HTTPException(status_code=404, detail="energyx list not found")
    await energyx_list.update({"$set": body.dict(exclude_unset=True)})
    energyx_list.updatedDate = datetime.utcnow()
    return await energyx_list.save()


@app.delete("/lists/{list_id}", response_class=Response, status_code=204)
async def delete_list(list_id: PydanticObjectId) -> None:
    """
    Deletes a energyx list by unique identifier
    """
    energyx_list = await energyxList.get(document_id=list_id)
    if not energyx_list:
        raise HTTPException(status_code=404, detail="energyx list not found")
    await energyx_list.delete()


@app.post("/lists/{list_id}/items", response_model=energyxItem, response_model_by_alias=False, status_code=201)
async def create_list_item(
    list_id: PydanticObjectId, body: CreateUpdateenergyxItem, request: Request, response: Response
) -> energyxItem:
    """
    Creates a new energyx item within a list
    """
    item = energyxItem(listId=list_id, **body.dict(), createdDate=datetime.utcnow())
    response.headers["Location"] = urljoin(str(request.base_url), "lists/{0}/items/{1}".format(str(list_id), str(item.id)))
    return await item.save()


@app.get("/lists/{list_id}/items", response_model=List[energyxItem], response_model_by_alias=False)
async def get_list_items(
    list_id: PydanticObjectId,
    top: Optional[int] = None,
    skip: Optional[int] = None,
) -> List[energyxItem]:
    """
    Gets energyx items within the specified list

    Optional arguments:

    - **top**: Number of lists to return
    - **skip**: Number of lists to skip
    """
    query = energyxItem.find(energyxItem.listId == list_id).skip(skip).limit(top)
    return await query.to_list()


@app.get("/lists/{list_id}/items/state/{state}", response_model=List[energyxItem], response_model_by_alias=False)
async def get_list_items_by_state(
    list_id: PydanticObjectId,
    state: energyxState = ...,
    top: Optional[int] = None,
    skip: Optional[int] = None,
) -> List[energyxItem]:
    """
    Gets a list of energyx items of a specific state

    Optional arguments:

    - **top**: Number of lists to return
    - **skip**: Number of lists to skip
    """
    query = (
        energyxItem.find(energyxItem.listId == list_id, energyxItem.state == state)
        .skip(skip)
        .limit(top)
    )
    return await query.to_list()


@app.put("/lists/{list_id}/items/state/{state}", response_model=List[energyxItem], response_model_by_alias=False)
async def update_list_items_state(
    list_id: PydanticObjectId,
    state: energyxState = ...,
    body: List[str] = None,
) -> List[energyxItem]:
    """
    Changes the state of the specified list items
    """
    if not body:
        raise HTTPException(status_code=400, detail="No items specified")
    results = []    
    for id_ in body:
        item = await energyxItem.get(document_id=id_)
        if not item:
            raise HTTPException(status_code=404, detail="energyx item not found")
        item.state = state
        item.updatedDate = datetime.utcnow()
        results.append(await item.save())
    return results


@app.get("/lists/{list_id}/items/{item_id}", response_model=energyxItem, response_model_by_alias=False)
async def get_list_item(
    list_id: PydanticObjectId, item_id: PydanticObjectId
) -> energyxItem:
    """
    Gets a energyx item by unique identifier
    """
    item = await energyxItem.find_one(energyxItem.listId == list_id, energyxItem.id == item_id)
    if not item:
        raise HTTPException(status_code=404, detail="energyx item not found")
    return item


@app.put("/lists/{list_id}/items/{item_id}", response_model=energyxItem, response_model_by_alias=False)
async def update_list_item(
    list_id: PydanticObjectId,
    item_id: PydanticObjectId,
    body: CreateUpdateenergyxItem,
) -> energyxItem:
    """
    Updates a energyx item by unique identifier
    """
    item = await energyxItem.find_one(energyxItem.listId == list_id, energyxItem.id == item_id)
    if not item:
        raise HTTPException(status_code=404, detail="energyx item not found")
    await item.update({"$set": body.dict(exclude_unset=True)})
    item.updatedDate = datetime.utcnow()
    return await item.save()


@app.delete("/lists/{list_id}/items/{item_id}", response_class=Response, status_code=204)
async def delete_list_item(
    list_id: PydanticObjectId, item_id: PydanticObjectId
) -> None:
    """
    Deletes a energyx item by unique identifier
    """
    energyx_item = await energyxItem.find_one(energyxItem.id == item_id)
    if not energyx_item:
        raise HTTPException(status_code=404, detail="energyx item not found")
    await energyx_item.delete()
