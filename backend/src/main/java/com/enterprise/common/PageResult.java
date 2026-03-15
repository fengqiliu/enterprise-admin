package com.enterprise.common;

import com.baomidou.mybatisplus.core.metadata.IPage;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * 分页响应结果类
 * @param <T> 数据类型
 */
@Data
@NoArgsConstructor
public class PageResult<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 数据列表
     */
    private List<T> records;

    /**
     * 总记录数
     */
    private Long total;

    /**
     * 当前页码
     */
    private Long current;

    /**
     * 每页大小
     */
    private Long size;

    /**
     * 总页数
     */
    private Long pages;

    /**
     * 构造分页结果
     */
    public PageResult(List<T> records, Long total, Long current, Long size) {
        this.records = records;
        this.total = total;
        this.current = current;
        this.size = size;
        this.pages = (total + size - 1) / size;
    }

    /**
     * 从 MyBatis-Plus IPage 转换
     */
    public static <T> PageResult<T> from(IPage<T> page) {
        return new PageResult<>(
            page.getRecords(),
            page.getTotal(),
            page.getCurrent(),
            page.getSize()
        );
    }

    /**
     * 空分页结果
     */
    public static <T> PageResult<T> empty() {
        return new PageResult<>(List.of(), 0L, 1L, 10L);
    }
}