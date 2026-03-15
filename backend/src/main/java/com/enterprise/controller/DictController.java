package com.enterprise.controller;

import com.enterprise.common.PageResult;
import com.enterprise.common.Result;
import com.enterprise.dto.DictDTO;
import com.enterprise.dto.DictItemDTO;
import com.enterprise.entity.Dict;
import com.enterprise.entity.DictItem;
import com.enterprise.service.DictService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 数据字典控制器
 */
@Tag(name = "数据字典", description = "字典类型和字典项管理接口")
@RestController
@RequestMapping("/business/dict")
@RequiredArgsConstructor
public class DictController {

    private final DictService dictService;

    // ===== 字典类型 =====

    @GetMapping("/list")
    @Operation(summary = "分页获取字典类型列表")
    @PreAuthorize("hasAuthority('business:dict:list')")
    public Result<PageResult<Dict>> listDict(
            @RequestParam(required = false) String dictName,
            @RequestParam(required = false) String dictType,
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size) {
        return Result.success(dictService.listDict(dictName, dictType, current, size));
    }

    @GetMapping("/{dictId}")
    @Operation(summary = "获取字典类型详情")
    @PreAuthorize("hasAuthority('business:dict:query')")
    public Result<Dict> getDictById(@PathVariable Long dictId) {
        return Result.success(dictService.getDictById(dictId));
    }

    @PostMapping
    @Operation(summary = "新增字典类型")
    @PreAuthorize("hasAuthority('business:dict:add')")
    public Result<Void> addDict(@Valid @RequestBody DictDTO dto) {
        dictService.addDict(dto);
        return Result.success();
    }

    @PutMapping
    @Operation(summary = "修改字典类型")
    @PreAuthorize("hasAuthority('business:dict:edit')")
    public Result<Void> updateDict(@Valid @RequestBody DictDTO dto) {
        dictService.updateDict(dto);
        return Result.success();
    }

    @DeleteMapping("/{dictId}")
    @Operation(summary = "删除字典类型")
    @PreAuthorize("hasAuthority('business:dict:delete')")
    public Result<Void> deleteDict(@PathVariable Long dictId) {
        dictService.deleteDict(dictId);
        return Result.success();
    }

    // ===== 字典项 =====

    @GetMapping("/{dictId}/items")
    @Operation(summary = "获取字典项列表（按字典ID）")
    public Result<List<DictItem>> listItemsByDictId(@PathVariable Long dictId) {
        return Result.success(dictService.listItemsByDictId(dictId));
    }

    @GetMapping("/{dictId}/items/page")
    @Operation(summary = "分页获取字典项列表")
    @PreAuthorize("hasAuthority('business:dict:list')")
    public Result<PageResult<DictItem>> listItems(
            @PathVariable Long dictId,
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size) {
        return Result.success(dictService.listItems(dictId, current, size));
    }

    @PostMapping("/item")
    @Operation(summary = "新增字典项")
    @PreAuthorize("hasAuthority('business:dict:add')")
    public Result<Void> addItem(@Valid @RequestBody DictItemDTO dto) {
        dictService.addItem(dto);
        return Result.success();
    }

    @PutMapping("/item")
    @Operation(summary = "修改字典项")
    @PreAuthorize("hasAuthority('business:dict:edit')")
    public Result<Void> updateItem(@Valid @RequestBody DictItemDTO dto) {
        dictService.updateItem(dto);
        return Result.success();
    }

    @DeleteMapping("/item/{itemId}")
    @Operation(summary = "删除字典项")
    @PreAuthorize("hasAuthority('business:dict:delete')")
    public Result<Void> deleteItem(@PathVariable Long itemId) {
        dictService.deleteItem(itemId);
        return Result.success();
    }
}
