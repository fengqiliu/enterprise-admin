package com.enterprise.service;

import com.enterprise.common.PageResult;
import com.enterprise.dto.DictDTO;
import com.enterprise.dto.DictItemDTO;
import com.enterprise.entity.Dict;
import com.enterprise.entity.DictItem;

import java.util.List;

/**
 * 字典服务接口
 */
public interface DictService {

    PageResult<Dict> listDict(String dictName, String dictType, Integer current, Integer size);

    Dict getDictById(Long dictId);

    void addDict(DictDTO dto);

    void updateDict(DictDTO dto);

    void deleteDict(Long dictId);

    List<DictItem> listItemsByDictId(Long dictId);

    PageResult<DictItem> listItems(Long dictId, Integer current, Integer size);

    void addItem(DictItemDTO dto);

    void updateItem(DictItemDTO dto);

    void deleteItem(Long itemId);
}
