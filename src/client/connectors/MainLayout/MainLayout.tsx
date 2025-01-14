import React, { FC, useEffect, useState } from 'react';
import { load } from '@2gis/mapgl';
import { getQuestions } from '../../api/api';
import classes from './MainLayout.module.scss';
import Search from 'antd/lib/input/Search';
import {
  ArrowUpOutlined,
  CopyOutlined,
  DeleteOutlined,
  LoadingOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import { Spin } from 'antd';

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SyntaxHighlighter from 'react-syntax-highlighter';

const CodeBlockWithCopy: FC<any> = ({ code, loading, onReload, onRemove }) => {
  const [copied, setCopied] = useState(false);

  const reload = () => {
    onReload();
  };

  const remove = () => {
    onRemove();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={classes.codeContainer}>
      <button
        onClick={handleCopy}
        className={classes.buttonCopy}
        disabled={loading}
      >
        {copied ? 'Скопировано !' : <CopyOutlined />}
      </button>
      <button
        onClick={reload}
        className={classes.buttonReload}
        disabled={loading}
      >
        {loading ? (
          <Spin
            indicator={
              <LoadingOutlined spin className={classes.spinContainer} />
            }
            size="small"
          />
        ) : (
          <RedoOutlined />
        )}
      </button>
      <button
        onClick={remove}
        className={classes.removeCopy}
        disabled={loading}
      >
        <DeleteOutlined />
      </button>
      <div className={classes.codeContainerItem}>
        <SyntaxHighlighter language="javascript">{code}</SyntaxHighlighter>
      </div>
    </div>
  );
};

interface IAnswerList {
  id: number;
  idContainer: string;
  body?: string;
  message: string;
  code: string;
  documentation: string;
  prompt: string;
}

const MainLayout = () => {
  const [promptData, setPromptData] = useState<{
    prompt?: string;
    idContainer: number;
  } | null>();
  const [loading, setLoading] = useState(false);
  const [answersList, setAnswersList] = useState<IAnswerList[]>([]);
  const [codeString, setCodeString] = useState('');
  const [codeContainerIDUpdate, setCodeContainerIDUpdate] = useState(0);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (codeString) {
      try {
        answersList.forEach((item) => {
          if (item.id === codeContainerIDUpdate) {
            eval(item.body || '');
          }
        });
      } catch (error) {
        console.error('Ошибка выполнения кода:', error);
      }
    }
  }, [answersList]);

  function extractJsonFromString(inputString: string, key: string) {
    // Находим начало и конец блока с кодом
    const bodyRegex = /body:\s*`([\s\S]*?)`,/;
    const match = inputString.match(bodyRegex);
    let bodyString;
    if (match) {
      bodyString = match[1]
        .split('\n') // Разделяем на строки
        .map((line) => line.trim()) // Убираем отступы
        .join('\n')
        .replace(/\\`/g, '`'); // Убираем обратный слэш перед обратной кавычкой
    } else {
      console.error('Поле body не найдено');
    }

    // Находим начало и конец блока с сообщением
    const messageStart =
      inputString.indexOf('message: "') + 'message: "'.length;
    const messageEnd = inputString.indexOf('"', messageStart);

    // Извлекаем строку с сообщением
    const messageString = inputString.slice(messageStart, messageEnd).trim();

    // Находим начало и конец блока с сообщением
    const documentationStart =
      inputString.indexOf('documentation: `') + 'documentation: `'.length;
    const documentationEnd = inputString.indexOf('`', documentationStart);

    // Извлекаем строку с сообщением
    const documentationString = inputString
      .slice(documentationStart, documentationEnd)
      .trim();

    // Ищем поле "key" в bodyString
    const keyPattern = /key:\s*'([^']*)'/;
    const keyMatch = inputString.match(keyPattern);
    let bodyStringFinish;
    if (keyMatch && bodyString) {
      // Если поле "key" найдено, заменяем его значение
      bodyStringFinish = bodyString?.replace(keyPattern, `key: '${key}'`);
    } else if (bodyString) {
      // Если поле "key" не найдено, добавляем его
      const keyInsertPosition = bodyString?.indexOf('zoom:') + 'zoom:'.length;
      bodyStringFinish =
        bodyString.slice(0, keyInsertPosition) +
        `, key: '${key}'` +
        bodyString.slice(keyInsertPosition);
    }
    // Возвращаем объект с извлеченными данными
    return {
      body: bodyStringFinish,
      code: bodyString,
      message: messageString,
      documentation: documentationString,
    };
  }

  const getIdNewContainer = () => {
    if (answersList.length === 0) {
      return 0;
    }
    return Math.max(...answersList.map((answer) => answer.id + 1));
  };

  useEffect(() => {
    if (promptData?.prompt?.length) {
      handleQuery();
      setPromptData(null);
    }
  }, [promptData]);

  const handleQuery = async () => {
    setLoading(true);
    try {
      const result = await getQuestions(
        1,
        promptData?.prompt || '',
        `container_${promptData?.idContainer}`,
      );

      const { body, message, code, documentation } = extractJsonFromString(
        result.data[0].message.content,
        '',
      );

      const id = promptData?.idContainer;

      setAnswersList((state) => [
        ...state,
        {
          id: id as number,
          idContainer: `container_${promptData?.idContainer}`,
          body,
          message,
          code,
          documentation,
          prompt: promptData?.prompt || '',
        },
      ]);
      setCodeString(body || '');
    } catch (error) {
      console.error('Ошибка:', error);
    }
    setLoading(false);
  };
  return (
    <div className={classes.root}>
      <div className={classes.textControlContainer}>
        <Search
          rootClassName={classes.textAreaContainerControl}
          className={classes.textAreaContainer}
          placeholder="Что бы Вы хотели узнать?"
          allowClear
          onSearch={(value) => {
            setPromptData({
              prompt: value,
              idContainer: getIdNewContainer(),
            });
            setCodeContainerIDUpdate(getIdNewContainer());
          }}
          enterButton={
            loading ? (
              <Spin
                indicator={
                  <LoadingOutlined spin className={classes.spinContainer} />
                }
                size="small"
              />
            ) : (
              <div>
                <ArrowUpOutlined />
              </div>
            )
          }
        />
      </div>
      <div className={classes.mainContainer}>
        {answersList
          .sort((a, b) => {
            return a.id - b.id;
          })
          .map((item) => {
            return (
              item?.code && (
                <div key={item.id}>
                  <div className={classes.responseContainer}>
                    <Markdown remarkPlugins={[remarkGfm]}>
                      {item.documentation}
                    </Markdown>
                  </div>
                  <div className={classes.logicContainer}>
                    <div
                      id={item.idContainer}
                      className={classes.mapContainer}
                    />
                    <CodeBlockWithCopy
                      code={item.code}
                      loading={loading}
                      onReload={() => {
                        setCodeString(item.prompt);
                        setPromptData({
                          prompt: item.prompt,
                          idContainer: item.id,
                        });
                        setCodeContainerIDUpdate(item.id);
                        setAnswersList((prevAnswersList) =>
                          prevAnswersList.filter(
                            (itemAnswer) => itemAnswer.id !== item.id,
                          ),
                        );
                      }}
                      onRemove={() => {
                        setAnswersList((prevAnswersList) => {
                          setCodeString('');
                          return prevAnswersList.filter(
                            (itemAnswer) => itemAnswer.id !== item.id,
                          );
                        });
                      }}
                    />
                  </div>
                </div>
              )
            );
          })}
      </div>
    </div>
  );
};

export default MainLayout;
