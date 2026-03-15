package com.enterprise.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.enterprise.entity.Dict;
import org.apache.ibatis.annotations.Mapper;

/**
 * 字典 Mapper 接口
 */
@Mapper
public interface DictMapper extends BaseMapper<Dict> {
}
