import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import  StoryPromptForm  from "../StoryPromptForm";

describe("StoryPromptForm", () => {
  test("não dispara onSubmit quando prompt está vazio", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(<StoryPromptForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button"));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test("mostra “Gerando...” em loading", async () => {
    const user = userEvent.setup();

    const onSubmit = jest.fn(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    render(<StoryPromptForm onSubmit={onSubmit} />);

    await user.type(screen.getByRole("textbox"), "um prompt");
    await user.click(screen.getByRole("button"));

    expect(screen.getByText(/Gerando/i)).toBeInTheDocument();
  });

  test("exibe mensagem de erro quando onSubmit lança", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn(async () => {
      throw new Error("Falhou");
    });

    render(<StoryPromptForm onSubmit={onSubmit} />);

    await user.type(screen.getByRole("textbox"), "um prompt");
    await user.click(screen.getByRole("button"));

    expect(await screen.findByText(/Falhou/i)).toBeInTheDocument();
  });
});