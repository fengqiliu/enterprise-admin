package com.enterprise.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.enterprise.common.PageResult;
import com.enterprise.dto.DictDTO;
import com.enterprise.dto.DictItemDTO;
import com.enterprise.entity.Dict;
import com.enterprise.entity.DictItem;
import com.enterprise.mapper.DictItemMapper;
import com.enterprise.mapper.DictMapper;
import com.enterprise.service.DictService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 字典服务实现类
 */
@Service
@RequiredArgsConstructor
public class DictServiceImpl implements DictService {

    private final DictMapper dictMapper;
    private final DictItemMapper dictItemMapper;

    @Override
    public PageResult<Dict> listDict(String dictName, String dictType, Integer current, Integer size) {
        Page<Dict> page = new Page<>(current, size);
        LambdaQueryWrapper<Dict> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(dictName != null && !dictName.isEmpty(), Dict::getDictName, dictName);
        wrapper.like(dictType != null && !dictType.isEmpty(), Dict::getDictType, dictType);
        wrapper.orderByDesc(Dict::getCreateTime);
        return PageResult.from(dictMapper.selectPage(page, wrapper));
    }

    @Override
    public Dict getDictById(Long dictId) {
        return dictMapper.selectById(dictId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addDict(DictDTO dto) {
        // 检查字典类型是否已存在
        LambdaQueryWrapper<Dict> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Dict::getDictType, dto.getDictType());
        if (dictMapper.selectCount(wrapper) > 0) {
            throw new RuntimeException("字典类型已存在");
        }
        Dict dict = new Dict();
        dict.setDictName(dto.getDictName());
        dict.setDictType(dto.getDictType());
        dict.setRemark(dto.getRemark());
        dictMapper.insert(dict);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateDict(DictDTO dto) {
        Dict dict = dictMapper.selectById(dto.getDictId());
        if (dict == null) {
            throw new RuntimeException("字典不存在");
        }
        dict.setDictName(dto.getDictName());
        dict.setRemark(dto.getRemark());
        dictMapper.updateById(dict);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteDict(Long dictId) {
        dictMapper.deleteById(dictId);
        // 同步删除字典项
        LambdaQueryWrapper<DictItem> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(DictItem::getDictId, dictId);
        dictItemMapper.delete(wrapper);
    }

    @Override
    public List<DictItem> listItemsByDictId(Long dictId) {
        LambdaQueryWrapper<DictItem> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(DictItem::getDictId, dictId);
        wrapper.orderByAsc(DictItem::getSortOrder);
        return dictItemMapper.selectList(wrapper);
    }

    @Override
    public PageResult<DictItem> listItems(Long dictId, Integer current, Integer size) {
        Page<DictItem> page = new Page<>(current, size);
        LambdaQueryWrapper<DictItem> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(dictId != null, DictItem::getDictId, dictId);
        wrapper.orderByAsc(DictItem::getSortOrder);
        return PageResult.from(dictItemMapper.selectPage(page, wrapper));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addItem(DictItemDTO dto) {
        DictItem item = new DictItem();
        item.setDictId(dto.getDictId());
        item.setItemLabel(dto.getItemLabel());
        item.setItemValue(dto.getItemValue());
        item.setSortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0);
        item.setStatus(dto.getStatus() != null ? dto.getStatus() : 1);
        dictItemMapper.insert(item);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateItem(DictItemDTO dto) {
        DictItem item = dictItemMapper.selectById(dto.getItemId());
        if (item == null) {
            throw new RuntimeException("字典项不存在");
        }
        item.setItemLabel(dto.getItemLabel());
        item.setItemValue(dto.getItemValue());
        item.setSortOrder(dto.getSortOrder());
        item.setStatus(dto.getStatus());
        dictItemMapper.updateById(item);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteItem(Long itemId) {
        dictItemMapper.deleteById(itemId);
    }
}
