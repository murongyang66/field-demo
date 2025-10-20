import { basekit, field, FieldComponent, FieldType, FieldCode } from "@lark-opdev/block-basekit-server-api";

// 获取国际化工具
const { t } = field;

// 添加字段捷径配置
basekit.addField({
  // 定义国际化语言资源
  i18n: {
    messages: {
      'zh-CN': {
        'inputText': '输入文本',
        'convertType': '转换类型',
        'textToBase64': '文本转Base64',
        'base64ToText': 'Base64转文本',
        'result': '转换结果'
      },
      'en-US': {
        'inputText': 'Input Text',
        'convertType': 'Convert Type',
        'textToBase64': 'Text to Base64',
        'base64ToText': 'Base64 to Text',
        'result': 'Result'
      }
    }
  },
  
  // 定义表单UI
  formItems: [
    {
      key: 'inputText',
      label: t('inputText'),
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Text],
        placeholder: '请选择需要转换的文本字段'
      },
      validator: {
        required: true
      }
    },
    {
      key: 'convertType',
      label: t('convertType'),
      component: FieldComponent.Radio,
      props: {
        options: [
          {
            label: t('textToBase64'),
            value: 'textToBase64'
          },
          {
            label: t('base64ToText'),
            value: 'base64ToText'
          }
        ]
      },
      validator: {
        required: true
      }
    }
  ],
  
  // 定义返回结果类型
  resultType: {
    type: FieldType.Text,
    extra: {
      icon: {
        light: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg'
      }
    }
  },
  
  // 执行转换的函数
  execute: async (formItemParams, context) => {
    try {
      // 解构获取表单参数
      const { inputText, convertType } = formItemParams;
      
      // 确保inputText有值
      if (!inputText || !inputText[0]) {
        return {
          code: FieldCode.Success,
          data: '输入字段为空'
        };
      }
      
      // 获取文本内容
      let text = '';
      if (inputText[0].type === 'text') {
        text = inputText[0].text || '';
      } else if (inputText[0].type === 'url') {
        text = inputText[0].text || '';
      } else {
        text = String(inputText[0]);
      }
      
      let result = '';
      
      // 根据选择的转换类型执行不同的转换
      if (convertType.value === 'textToBase64') {
        // 文本转Base64
        result = Buffer.from(text).toString('base64');
      } else if (convertType.value === 'base64ToText') {
        // Base64转文本
        try {
          result = Buffer.from(text, 'base64').toString('utf8');
        } catch (e) {
          // 如果base64格式不正确，返回错误信息
          return {
            code: FieldCode.Success,
            data: 'Base64格式不正确，请检查输入内容'
          };
        }
      }
      
      // 返回转换结果
      return {
        code: FieldCode.Success,
        data: result
      };
    } catch (error) {
      console.error('转换过程中发生错误:', error);
      return {
        code: FieldCode.Error
      };
    }
  }
});

// 导出basekit
export default basekit;
