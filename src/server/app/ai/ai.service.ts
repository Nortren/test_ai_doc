import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai;
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
    });
  }

  getQuestions = async (
    page = 1,
    question = '',
    containerID = 'container',
  ): Promise<any> => {
    const modifyPromt = `Отвечая на этот вопрос \`${question}\` на @2gis/mapgl, если это возможно реализовать пример прошли в корректной формате \`\`\`js{body: \"код ответа\", message: \"доп информация\", documentation: \"кратко сделай авто документацию по сгенерированному коду в формате markdown\" }\`\`\`js где body будет модификация этого кода 
     const map = new mapgl.Map('${containerID}', {
            center: [55.323, 25.235],
            zoom: 10.5, 
            key: '',
        });
    
 если нет то {message:'к сожалению Ваш вопрос не корректный'}`;

    const stream = await this.openai.beta.chat.completions.stream({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: modifyPromt }],
      stream: true,
    });

    // stream.on('content', (delta, snapshot) => {
    //   process.stdout.write(delta);
    // });
    //
    // // or, equivalently:
    // for await (const chunk of stream) {
    //   process.stdout.write(chunk.choices[0]?.delta?.content || '');
    // }

    const chatCompletion = await stream.finalChatCompletion();

    try {
      return { data: chatCompletion.choices };
    } catch (error) {
      throw Error('Data acquisition error');
    }
  };
}
